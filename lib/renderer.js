var Viz = require("viz.js");

var reg = /(\s*)(```) *(dot) *((?:{[\s\S]+?})?)\n?([\s\S]+?)\s*(\2)(\n+|$)/g;

function ignore(data) {
    var source = data.source;
    var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
    return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

exports.render = function (data) {
    if (!ignore(data)) {
        data.content = data.content
            .replace(reg, function (raw, start, startQuote, lang, options, content, endQuote, end) {
                var vizEngine = "dot";
                if (options && 0 !== options.length){
                    var correctJson = options.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*[:=]/g, '"$2": ');
                    var vizOptions = JSON.parse(correctJson);
                    vizEngine =  vizOptions["engine"] || "dot";
                }
                var svgxml = Viz(content, {engine:vizEngine});
                var svg = svgxml.substring(svgxml.indexOf("<svg")).trim();
                // console.log("raw:\n" + raw + "\nconverted to:\n" + start + '<p>\n' + svg + '\n</p>' + end);
                return start + '{% raw %}' + '<p>\n' + svg + '</p>' + '{% endraw %}' + end;
            });
    }
};