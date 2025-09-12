package core

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/richardgong1987/server/global"
	"github.com/richardgong1987/server/initialize"
	"github.com/richardgong1987/server/service/system"
	"go.uber.org/zap"
)

func RunServer() *gin.Engine {
	if global.GVA_CONFIG.System.UseRedis {
		// 初始化redis服务
		initialize.Redis()
		if global.GVA_CONFIG.System.UseMultipoint {
			initialize.RedisList()
		}
	}

	if global.GVA_CONFIG.System.UseMongo {
		err := initialize.Mongo.Initialization()
		if err != nil {
			zap.L().Error(fmt.Sprintf("%+v", err))
		}
	}
	// 从db加载jwt数据
	if global.GVA_DB != nil {
		system.LoadAll()
	}

	Router := initialize.Routers()

	address := fmt.Sprintf(":%d", global.GVA_CONFIG.System.Addr)

	fmt.Printf(``, address, address, global.GVA_CONFIG.MCP.SSEPath, address, global.GVA_CONFIG.MCP.MessagePath)
	initServer(address, Router, 10*time.Minute, 10*time.Minute)
	return Router
}
