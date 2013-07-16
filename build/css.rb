LESS = FileList['styles/**/*.less']
SRC_CSS = FileList['styles/**/*'].exclude('**/*.min.css').exclude('**/*.winjs.*').include(FileList['styles/**/kendo*.less'].ext('css')).uniq
MIN_CSS = FileList['styles/**/kendo*.less']
    .include('styles/**/*.css')
    .exclude('**/*.min.css')
    .ext('min.css')
    .uniq
LEGACY_MIN_CSS = FileList['wrappers/mvc/legacy-themes/*.css']
    .exclude('**/*.min.css')
    .ext('min.css')

MIN_CSS_RESOURCES = FileList[MIN_CSS].include('styles/*/*/*').exclude('**/*.less').exclude('**/*.winjs.*')

WEB_MIN_CSS = FileList[MIN_CSS_RESOURCES].keep_if { |f| f =~ /styles\/web\// }
WEB_SRC_CSS = FileList[SRC_CSS].keep_if { |f| f =~ /styles\/web\// }

MOBILE_MIN_CSS = FileList[MIN_CSS_RESOURCES].keep_if { |f| f =~ /styles\/mobile\// }
MOBILE_SRC_CSS = FileList[SRC_CSS].keep_if { |f| f =~ /styles\/mobile\// }

DATAVIZ_MIN_CSS = FileList[MIN_CSS_RESOURCES].keep_if { |f| f =~ /styles\/dataviz\// }
DATAVIZ_SRC_CSS = FileList[SRC_CSS].keep_if { |f| f =~ /styles\/dataviz\// }

WIN_SRC_CSS = FileList['styles/web/kendo.common.css'].include('styles/dataviz/kendo.dataviz.css').include('styles/web/kendo.rtl.css')
WIN_MIN_CSS = FileList['styles/web/kendo.winjs.min.css']

ICENIUM_MIN_CSS = FileList['styles/mobile/kendo.icenium.min.css'].include(DATAVIZ_MIN_CSS).exclude('styles/dataviz/kendo.dataviz.min.css')

file_merge 'styles/web/kendo.winjs.css' => [
    'styles/web/kendo.common.css',
    'styles/dataviz/kendo.dataviz.css',
    'styles/dataviz/kendo.dataviz.default.css'
]

file 'styles/web/kendo.winjs.css' => 'build/css.rb'

file_merge 'styles/mobile/kendo.icenium.css' => [
    'styles/mobile/kendo.mobile.icenium.css',
    'styles/dataviz/kendo.dataviz.css',
]

file 'styles/mobile/kendo.icenium.css' => 'build/css.rb'

CLEAN.include(MIN_CSS)
    .include('styles/web/kendo.winjs.css')
    .include('styles/mobile/kendo.icenium.css')
    .include(LESS.ext('css'))
    .include(LEGACY_MIN_CSS)

def find_less_src(lessfile)
    filename = lessfile.pathmap("%f")

    LESS.find { |less| File.basename(less) == filename }
end

def find_less_prerequisites(lessfile)
    dirname = lessfile.pathmap("%d")

    src = find_less_src(lessfile)

    return unless src

    less = File.read(src)

    prerequisites = FileList[less.scan(/@import "(.+)";/).flatten].pathmap("#{dirname}/%f")

    [lessfile].concat(prerequisites)
end

#Build styles/kendo*.css files by running less over styles/kendo*.less
rule '.css' => ['.less', lambda { |target| find_less_prerequisites(target.ext('less')) } ] do |t|
    less(t.source, t.name);
end

#Build styles/kendo*.min.css by running cssmin over styles/kendo*.css
rule '.min.css' => lambda { |target| target.sub('min.css', 'css') } do |t|
    cssmin(t.source, t.name)
end
