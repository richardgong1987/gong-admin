package core

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/richardgong1987/server/global"
	"github.com/richardgong1987/server/initialize"
	"github.com/richardgong1987/server/service/system"
	"go.uber.org/zap"
)

type server interface {
	ListenAndServe() error
}

func RunWindowsServer(isUnitTest bool) *gin.Engine {
	if global.GVA_CONFIG.System.UseMultipoint || global.GVA_CONFIG.System.UseRedis {
		// 初始化redis服务
		initialize.Redis()
		initialize.RedisList()
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
	Router.Static("/form-generator", "./resource/page")

	address := fmt.Sprintf(":%d", global.GVA_CONFIG.System.Addr)
	s := initServer(address, Router)

	global.GVA_LOG.Info("server run success on ", zap.String("address", address))
	if isUnitTest {
		go func() {
			global.GVA_LOG.Error(s.ListenAndServe().Error())
		}()
	} else {
		global.GVA_LOG.Error(s.ListenAndServe().Error())
	}

	return Router
}
