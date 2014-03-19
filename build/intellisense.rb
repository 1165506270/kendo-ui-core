require 'erb'
require 'codegen/lib/options'
require 'codegen/lib/markdown_parser'
require 'codegen/lib/component'

INTELLISENSE_DOC_TEMPLATE_CONTENTS = File.read(File.join(File.dirname(__FILE__), "intellisense.js.erb"))
INTELLISENSE_DOC_TEMPLATE = ERB.new INTELLISENSE_DOC_TEMPLATE_CONTENTS, 0, '%<>'

module CodeGen::IntelliSense
    EXCLUDE = [
        'docs/api/framework/fx.md'
    ]

    class Component < CodeGen::Component

        def real_class?
            @name =~ /[A-Z]\w+$/
        end

        def plugin
            prefix = ""
            prefix = "Mobile" if @full_name =~ /mobile\./
            'kendo' + prefix + @name
        end

        def method_class
            Method
        end

        def methods
            @methods.find_all { |m| !m.name.include?('.') }
        end

        def redirect
            "_#{full_name.downcase.gsub('.', '_')}"
        end

        def namespace
            @full_name.sub('.' + @name, '')
        end
    end

    class Method < CodeGen::Method

        def parameters
            @parameters.find_all { |p| !p.name.include?('.') }
        end

        def parameter_class
            Parameter
        end
    end

    class Parameter < CodeGen::Parameter
        def intellisense_type
            return 'Object' if @type.size > 1

            @type[0]
        end
    end
end

def get_intellisense(sources)

    sources = sources.find_all { |source| !CodeGen::IntelliSense::EXCLUDE.include?(source) }

    classes = sources.map do |source|
        parser = CodeGen::MarkdownParser.new

        File.open(source, 'r:bom|utf-8') do |file|
            parser.parse(file.read, CodeGen::IntelliSense::Component)
        end
    end

    classes.sort! {|a, b| a.full_name <=> b.full_name }

    INTELLISENSE_DOC_TEMPLATE.result(binding)
end

class IntellisenseTask < Rake::FileTask
    include Rake::DSL
    def execute(args=nil)
        mkdir_p File.dirname(name), :verbose => false

        $stderr.puts("Creating #{name}") if VERBOSE

        File.open(name, "w") do |file|
            file.write get_intellisense(prerequisites)
        end
    end
end

def intellisense(*args, &block)
    IntellisenseTask.define_task(*args, &block)
end

namespace :intellisense do
    %w(master production).each do |branch|
        namespace branch do
            desc "Test .intellisense generation"
            task :test do
                sync_docs_submodule(branch)
                File.open("dist/kendo.intellisense-#{branch}.js", "w") do |f|
                    f.write get_intellisense(MD_API_SUITES['all'])
                    sh "node_modules/jshint/bin/jshint #{f.path}"
                end
            end
        end
    end
end
