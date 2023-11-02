package constant

import "time"

// 普通常量
const (
	DebugMode    = "debug"
	UserID       = "userID"
	DoAction     = "1"
	UndoAction   = "2"
	TokenTimeOut = 24 * time.Hour
	SnoyFlakeStartTime = 1698775594477
)
