package initialize

import (
	_ "github.com/richardgong1987/server/source/example"
	_ "github.com/richardgong1987/server/source/system"
)

func init() {
	// do nothing,only import source package so that inits can be registered
}
