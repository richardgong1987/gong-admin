package router

import (
	"github.com/richardgong1987/server/router/biz"
	"github.com/richardgong1987/server/router/example"
	"github.com/richardgong1987/server/router/system"
)

var RouterGroupApp = new(RouterGroup)

type RouterGroup struct {
	System  system.RouterGroup
	Example example.RouterGroup
	Biz     biz.RouterGroup
}
