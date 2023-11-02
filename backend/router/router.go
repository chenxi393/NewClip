package router

import (
	"newclip/handler"
	"newclip/package/util"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func InitRouter(app *fiber.App) {
	app.Use(cors.New())
	api := app.Group("/newclip")
	{
		// 新增接口 搜索功能 可以拓展搜索用户
		search := api.Get("/search")
		{
			search.Get("/video/", handler.SearchVideo)
		}
		api.Get("/feed/", handler.Feed)
		user := api.Group("/user")
		user.Get("/", handler.UserInfo) // 这里是用来看个人主页的需要鉴权
		{
			user.Post("/register/", handler.UserRegister)
			user.Post("/login/", handler.UserLogin)
		}
		publish := api.Group("/publish")
		{
			publish.Post("/action/", util.Authentication, handler.PublishAction)
			publish.Get("/list/", handler.ListPublishedVideo)
		}
		favorite := api.Group("/favorite")
		{
			favorite.Post("/action/", util.Authentication, handler.FavoriteVideoAction)
			favorite.Get("/list/", handler.FavoriteList)
		}
		comment := api.Group("/comment")
		{
			comment.Post("/action/", util.Authentication, handler.CommentAction)
			comment.Get("/list/", handler.CommentList)
		}
		relation := api.Group("/relation")
		{
			relation.Post("/action/", util.Authentication, handler.RelationAction)
			relation.Get("/follow/list/", handler.FollowList)
			relation.Get("/follower/list/", handler.FollowerList)
			relation.Get("/friend/list/", util.Authentication, handler.FriendList)
		}
		messgae := api.Group("/message")
		{
			messgae.Post("/action/", util.Authentication, handler.MessageAction)
			messgae.Get("/chat/", util.Authentication, handler.MessageChat)
		}
	}
}
