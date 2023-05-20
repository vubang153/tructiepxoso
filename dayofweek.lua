obs = obslua
source_name = ""
activated = false

function set_datetime_text(source, text)
    local settings = obs.obs_data_create()
    obs.obs_data_set_string(settings, "text", text)
    obs.obs_source_update(source, settings)
    obs.obs_data_release(settings)
end

function timer_callback()
    local source = obs.obs_get_source_by_name(source_name)
    if source ~= nil then
        local weekdays = {"Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"}
        local date = os.date("*t")
        local text = weekdays[date.wday]
        set_datetime_text(source, text)
        obs.obs_source_release(source)
    end
end

function activate(activating)
    if activated == activating then
        return
    end

    activated = activating

    if activating then
        obs.timer_add(timer_callback, 86400)
    else
        obs.timer_remove(timer_callback)
    end
end

function activate_signal(cd, activating)
    local source = obs.calldata_source(cd, "source")
    if source ~= nil then
        local name = obs.obs_source_get_name(source)
        if (name == source_name) then
            activate(activating)
        end
    end
end

function source_activated(cd)
    activate_signal(cd, true)
end

function source_deactivated(cd)
    activate_signal(cd, false)
end

function reset()
    activate(false)
    local source = obs.obs_get_source_by_name(source_name)
    if source ~= nil then
        local active = obs.obs_source_showing(source)
        obs.obs_source_release(source)
        activate(active)
    end
end

function script_description()
    return "Sets a text source to display the day of the week in Vietnamese."
end

function script_properties()
    local props = obs.obs_properties_create()

    local p = obs.obs_properties_add_list(props, "source", "Text Source", obs.OBS_COMBO_TYPE_EDITABLE, obs.OBS_COMBO_FORMAT_STRING)
    local sources = obs.obs_enum_sources()
    if sources ~= nil then
        for _, source in ipairs(sources) do
            source_id = obs.obs_source_get_id(source)
            if source_id == "text_gdiplus" or source_id == "text_ft2_source" then
                local name = obs.obs_source_get_name(source)
                obs.obs_property_list_add_string(p, name, name)
            end
        end
    end
    obs.source_list_release(sources)

    return props
end

function script_update(settings)
    activate(false)

    source_name = obs.obs_data_get_string(settings, "source")

    reset()
end

function script_load(settings)
    local sh = obs.obs_get_signal_handler()
    obs.signal_handler_connect(sh, "source_show", source_activated)
    obs.signal_handler_connect(sh, "source_hide", source_deactivated)
end
