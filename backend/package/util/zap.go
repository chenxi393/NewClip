package util

import (
	"newclip/config"
	"newclip/package/constant"

	"go.uber.org/zap"
)

func InitZap() {
	var logger *zap.Logger
	if config.System.Mode == constant.DebugMode {
		logger, _ = zap.NewDevelopment()
	} else {
		logger, _ = zap.NewProduction()
	}
	defer logger.Sync()
	zap.ReplaceGlobals(logger)
	logger.Sugar().Infof("zap initialization succeed!   Mode: %s", logger.Level().String())
}
