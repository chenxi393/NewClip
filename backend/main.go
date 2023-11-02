package main

import (
	"newclip/config"
	"newclip/database"
	"newclip/package/util"
	"newclip/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"go.uber.org/zap"
)

func main() {
	config.Init()
	util.InitZap()
	database.InitMySQL()
	// TODO redis mq

	// 注意！ 当上传文件超过30MB时 将会返回413 正式上线应该更小
	app := fiber.New(fiber.Config{
		BodyLimit: 30 * 1024 * 1024,
	})
	app.Use(logger.New())
	router.InitRouter(app)
	zap.L().Fatal("fiber启动失败: ", zap.Error(app.Listen(
		config.System.HttpAddress.Host+":"+config.System.HttpAddress.Port)))
}
