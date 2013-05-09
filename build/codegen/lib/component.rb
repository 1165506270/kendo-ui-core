require 'string'
require 'method'
require 'composite_option'
require 'array_option'
require 'option'
require 'event'

module CodeGen
    TYPES = ['Object',
             'Date',
             'Array',
             'String',
             'Number',
             'Boolean',
             'Function']

    class Component
        include Options

        attr_reader :full_name, :name, :options, :events, :methods

        def initialize(settings)
            @full_name = settings[:name]
            @name = @full_name.split('.').last
            @options = []
            @events = []
            @methods = []
            @content = false
        end

        def method_class
            Method
        end

        def api_link
            directory = 'web';

            directory = 'framework' if @full_name.start_with?('kendo.data.')
            directory = 'dataviz' if @full_name.start_with?('kendo.dataviz')

            "/api/#{directory}/#{name.downcase}"
        end

        def widget?
            @full_name.include?('.ui.')
        end

        def content?
            @content
        end

        def import(metadata)
            @content = metadata[:content]

            metadata[:options].each do |option|

                @options.delete_if { |o| o.name == option[:name] }

                add_option(option)

            end
        end

        def add_method(settings)
            settings[:owner] = self

            method = method_class.new(settings)

            @methods.push(method)

            method
        end

        def add_event(settings)
            settings[:owner] = self

            event = event_class.new(settings)

            @events.push(event)

            event
        end
    end

end #module CodeGen
