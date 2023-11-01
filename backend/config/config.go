package config

import (
	"log"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"
)

type MysqlConfig struct {
	Host        string `mapstructure:"host"`
	Port        string `mapstructure:"port"`
	UserName    string `mapstructure:"username"`
	Password    string `mapstructure:"password"`
	Database    string `mapstructure:"database"`
	MaxOpenConn int    `mapstructure:"maxOpenConn"`
	MaxIdleConn int    `mapstructure:"maxIdleConn"`
}

type HttpConfig struct {
	Host            string `mapstructure:"host"`
	Port            string `mapstructure:"port"`
	DefaultCoverURL string `mapstructure:"defaultCoverURL"`
}

type RedisConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	Database int    `mapstructure:"db"`
	PoolSize int    `mapstructure:"poolSize"`
	Password string `mapstructure:"password"`
}

type RabbitMQ struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
}

type QiNiuCloud struct {
	Bucket    string `mapstructure:"bucket"`
	AccessKey string `mapstructure:"accessKey"`
	SecretKey string `mapstructure:"secretKey"`
	OssDomain string `mapstructure:"ossDomain"`
}

type System struct {
	Qiniu        QiNiuCloud  `mapstructure:"qiniu"`
	HttpAddress  HttpConfig  `mapstructure:"httpAddress"`
	MysqlMaster  MysqlConfig `mapstructure:"mysqlMaster"`
	MysqlSlave   MysqlConfig `mapstructure:"mysqlSlave"`
	UserRedis    RedisConfig `mapstructure:"userRedis"`
	VideoRedis   RedisConfig `mapstructure:"videoRedis"`
	CommentRedis RedisConfig `mapstructure:"commentRedis"`
	MQ           RabbitMQ    `mapstructure:"rabbitmq"`
	Mode         string      `mapstructure:"mode"`
	JwtSecret    string      `mapstructure:"jwtSecret"`
}

var SystemConfig System

func Init() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./config/")

	err := viper.ReadInConfig() 
	if err != nil {           
		log.Fatal("fatal error config file: ", err.Error())
	}

	err = viper.Unmarshal(&SystemConfig)
	if err != nil {
		log.Fatal("fatal error unmarshal config: ", err.Error())
	}

	// 监视配置文件的变化
	viper.WatchConfig()
	viper.OnConfigChange(func(in fsnotify.Event) {
		log.Println("配置文件被修改")
	})
	log.Println("viper读取配置文件成功")
}

