#!/bin/bash

set -e

## config for sync
MASTER_HOST="${MASTER_HOST:-127.0.0.1}"
MASTER_PORT="${MASTER_PORT:-3306}"
MASTER_SYNC_USER="${MASTER_SYNC_USER:-sync_admin}"
MASTER_SYNC_PASSWORD="${MASTER_SYNC_PASSWORD:-sync_admin123456}"

SLAVE_ADMIN_USER="root"
SLAVE_ADMIN_PASSWORD="${MYSQL_ROOT_PASSWORD:-admin123456}"

sleep 10

RESULT=`mysql -h$MASTER_HOST -p$MASTER_PORT -u"$MASTER_SYNC_USER" -p"$MASTER_SYNC_PASSWORD" -e "SHOW MASTER STATUS;" | grep -v grep |tail -n +2| awk '{print $1,$2}'`
LOG_FILE_NAME=`echo $RESULT | grep -v grep | awk '{print $1}'`
LOG_FILE_POS=`echo $RESULT | grep -v grep | awk '{print $2}'`

SYNC_SQL="""
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='$MASTER_HOST',
  SOURCE_PORT=$MASTER_PORT,
  SOURCE_USER='$MASTER_SYNC_USER',
  SOURCE_PASSWORD='$MASTER_SYNC_PASSWORD',
  SOURCE_LOG_FILE='$LOG_FILE_NAME',
  SOURCE_LOG_POS=$LOG_FILE_POS,
  SOURCE_CONNECT_RETRY=10;
"""
START_SYNC_SQL="START REPLICA;"
STATUS_SQL="SHOW REPLICA STATUS\G;"

mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$SYNC_SQL"
mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$START_SYNC_SQL"
mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$STATUS_SQL"

##  如下用户是为了给程序添加只读的账号，不是用于主从同步的。
R_USER=${R_USER:-u_rw}
R_USER_PASSWORD=${R_USER_PASSWORD:-urw_pwd123456}
R_USER_HOST=${R_USER_HOST:-%}
R_DATABASE=${R_DATABASE:-*}

CREATE_R_USER_SQL="CREATE USER '$R_USER'@'$R_USER_HOST' IDENTIFIED WITH mysql_native_password BY '$R_USER_PASSWORD';"
GRANT_R_PRIVILEGES_SQL="GRANT XA_RECOVER_ADMIN,SELECT ON $R_DATABASE.* TO '$R_USER'@'$R_USER_HOST';"
FLUSH_R_PRIVILEGES_SQL="FLUSH PRIVILEGES;"

mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$CREATE_R_USER_SQL"
mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$GRANT_R_PRIVILEGES_SQL"
mysql -u"$SLAVE_ADMIN_USER" -p"$SLAVE_ADMIN_PASSWORD" -e "$FLUSH_R_PRIVILEGES_SQL"