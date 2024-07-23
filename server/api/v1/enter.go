package v1

import (
	"github.com/richardgong1987/server/api/v1/example"
	"github.com/richardgong1987/server/api/v1/system"
)

var ApiGroupApp = new(ApiGroup)

type ApiGroup struct {
	SystemApiGroup  system.ApiGroup
	ExampleApiGroup example.ApiGroup
}
