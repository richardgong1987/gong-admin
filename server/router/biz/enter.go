package biz

import api "github.com/richardgong1987/server/api/v1"

type RouterGroup struct{ BizLaptopManagementRouter }

var bizLaptopManagementApi = api.ApiGroupApp.BizApiGroup.BizLaptopManagementApi
