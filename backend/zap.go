package main

import (
	"newclip/config"

	"go.uber.org/zap"
)

func InitZap() {
	var logger *zap.Logger
	if config.SystemConfig.Mode == "debug" {
		logger, _ = zap.NewDevelopment()
	} else {
		logger, _ = zap.NewProduction()
	}

	defer logger.Sync()
	zap.ReplaceGlobals(logger)
	logger.Sugar().Infof("zap initialization succeed!   Mode: %s", logger.Level().String())
}
