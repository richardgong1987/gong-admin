package service

import (
	"github.com/richardgong1987/server/service/biz"
	"github.com/richardgong1987/server/service/example"
	"github.com/richardgong1987/server/service/system"
)

var ServiceGroupApp = new(ServiceGroup)

type ServiceGroup struct {
	SystemServiceGroup  system.ServiceGroup
	ExampleServiceGroup example.ServiceGroup
	BizServiceGroup     biz.ServiceGroup
}
