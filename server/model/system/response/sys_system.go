package response

import "github.com/richardgong1987/server/config"

type SysConfigResponse struct {
	Config config.Server `json:"config"`
}
