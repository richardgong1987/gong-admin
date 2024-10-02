package utils

import (
	"github.com/go-rod/rod/lib/proto"
	"github.com/luabagg/orcgen/v2"
)

var htmltoPDFTool = orcgen.NewHandler(proto.PagePrintToPDF{
	Landscape:         true,
	PrintBackground:   true,
	PreferCSSPageSize: true,
})

func HtmlToPDF(html []byte) ([]byte, error) {
	htmltoPDFTool.SetFullPage(true)
	fi, err := orcgen.ConvertHTML(htmltoPDFTool, html)
	if err != nil {
		return nil, err
	}
	return fi.File, nil
}
