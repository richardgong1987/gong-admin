package biz

import "github.com/richardgong1987/server/service"

type ApiGroup struct{ BizLaptopManagementApi }

var bizLaptopManagementService = service.ServiceGroupApp.BizServiceGroup.BizLaptopManagementService
