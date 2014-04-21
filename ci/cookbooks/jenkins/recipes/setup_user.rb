case node["platform"]
when "windows"
    directory "c:\\Users\\KendoBuildUser\\.ssh" do
        action :create
    end

    %w[id_rsa id_rsa.pub authorized_keys known_hosts config].each do |file|
        cookbook_file "c:\\Users\\KendoBuildUser\\.ssh\\#{file}" do
            source "ssh/#{file}"
        end
    end
else
    bash "set jenkins users shell" do
        code "chsh -s /bin/zsh jenkins"
    end

    %w[zshrc gitconfig netrc].each do |file|
        cookbook_file "/var/lib/jenkins/.#{file}" do
            source "#{file}"
            owner "jenkins"
            group "nogroup"
            mode "0600"
        end
    end

    directory "/var/lib/jenkins/.ssh" do
        owner "jenkins"
        group "nogroup"
        mode "0700"
    end

    %w[id_rsa id_rsa.pub authorized_keys known_hosts config].each do |file|
        cookbook_file "/var/lib/jenkins/.ssh/#{file}" do
            source "ssh/#{file}"
            owner "jenkins"
            group "nogroup"
            mode "0600"
        end
    end

    cron "cleanup_firefox_profile" do
        minute "0"
        hour "23"
        day "*"
        month "*"
        weekday "*"
        command "find /var/lib/jenkins/.mozilla/firefox -maxdepth 1 -type d -mtime +3 -exec rm -r {} \\\;"
        action :create
    end

    cron "cleanup_chrome_profile" do
        minute "0"
        hour "20"
        day "*"
        month "*"
        weekday "*"
        command "find /tmp/.com.google.Chrome.* -maxdepth 0 -type d -mtime +2 -exec rm -r {} \\\;"
        action :create
    end
end
