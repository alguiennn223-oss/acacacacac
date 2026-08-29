local m = { version = "v1.6" }

local content_root = ".\\content\\cut-scenes\\"

local map
local current_seq
local random_choice
local messages = ""
local object_ptr
local table_mode_map

local action_reload_map = { label='9', vkey=0x39 }
local action_clear_messages = { label='0', vkey=0x30 }

local function load_map(filename)
    local t = { sequences = {}, choices = {} }
    local f = io.open(filename)
    if f then
        f:close()
        local key, seq
        for line in io.lines(filename) do
            local comment_start = line:find(";")
            if comment_start and comment_start > 0 then
                -- drop comment
                line = line:sub(1, comment_start-1)
            end
            local s = line:match("%[([^%]]+)%]")
            if s then
                local name = s:gsub("^%s*",""):gsub("%s*$","")
                if name ~= "" and name:sub(1,1) == '/' then
                    -- end of seqeunce
                    seq = nil
                elseif name ~= "" then
                    -- new seq
                    key = name:gsub("/","\\")
                    seq = { name = name, mappings = {} }
                end
            else
                local filekey, filepath = line:match("(%S+)%s*=%s*(%S+)")
                if filekey ~= nil and filepath ~= nil then
                    filekey = filekey:gsub("/","\\")
                    filepath = filepath:gsub("/","\\")
                    if seq then
                        -- inside of a sequence
                        local s = t.sequences[filekey] or {}
                        t.sequences[filekey] = s
                        s[#s + 1] = seq
                        seq.mappings[filekey] = filepath
                    else
                        -- outside of sequence
                        local c = t.choices[filekey] or {}
                        t.choices[filekey] = c
                        c[#c + 1] = filepath
                    end
                end
            end
        end
    end
    return t
end

local function log_map()
    log("sequences:")
    for k, sequences in pairs(map.sequences) do
        for _, seq in ipairs(sequences) do
            v = seq.mappings[k]
            log(string.format("[%s] %s ==> %s", seq.name, k, v))
        end
    end
    log("choices:")
    for k, choices in pairs(map.choices) do
        for _, v in ipairs(choices) do
            log(string.format("%s ==> %s", k, v))
        end
    end
end

local function get_table_mode_addr()
    if object_ptr then
        local obj = memory.unpack("u64", memory.read(object_ptr, 8))
        if obj then
            local addr = memory.unpack("u64", memory.read(obj + 0x128, 8))
            return addr
        end
    end
end

local function load_table_mode_map(filename)
    local t = {}
    local f = io.open(filename)
    if f then
        f:close()
        local offs, choices
        for line in io.lines(filename) do
            -- check for section start
            local hdr = string.match(line, "%[(%x+)%]")
            if hdr then
                offs = tonumber(hdr, 16)
                choices = {}
                t[offs] = choices
            else
                -- check for choices
                local chars = {}
                for s in string.gmatch(line, "%x%x") do
                    chars[#chars + 1] = string.char(tonumber(s, 16))
                end
                if #chars > 0 then
                    -- add as a choice
                    choices[#choices + 1] = table.concat(chars)
                end
            end
        end
    end
    return t
end

local function log_table_mode_map()
    for offs, choices in pairs(table_mode_map) do
        for i, chars in ipairs(choices) do
            log(string.format("table mode map: offset=0x%x: %s", offs, chars:gsub(".", function(c)
                return string.format("%02x ", string.byte(c))
            end)))
        end
    end
end

local function get_random_choice(ctx)
    if not random_choice then
        random_choice = math.random(1,100)
        log(string.format("random number chosen: %d", random_choice))
    end
    return random_choice
end

local function shuffle_table_mode()
    local addr = get_table_mode_addr()
    if not addr then
        log("table_mode addr is nil. Nothing to do then")
        return
    end
    for offs, choices in pairs(table_mode_map) do
        -- for each offset, choose randomly from choices
        local i = math.random(1,#choices)
        local chars = choices[i]
        -- write this byte sequence
        memory.write(addr + offs, chars)
        log(string.format("table_mode shuffle: offset=0x%x: %s", offs, chars:gsub(".", function(c)
            return string.format("%02x ", string.byte(c))
        end)))
    end
end

local function reset_random_choice()
    random_choice = nil
    current_seq = nil
    log(string.format("table_mode.bin: %s", memory.hex(get_table_mode_addr())))
    shuffle_table_mode()
end

function m.set_teams(ctx, home, away)
    reset_random_choice()
end

function m.set_home_team_for_kits(ctx, team_id)
    reset_random_choice()
end

function m.get_filepath(ctx, filename)
    local i, fname
    i = get_random_choice(ctx)
    -- check sequences first
    if not current_seq then
        local slist = map.sequences[filename]
        if slist and #slist > 0 then
            -- choose a sequence at random
            i = ((i-1) % #slist) + 1
            current_seq = slist[i]
            log(string.format("current_seq chosen randomly from %d variants: %s", #slist, current_seq.name))
        end
    end
    if current_seq then
        local path = current_seq.mappings[filename]
        if path then
            fname = content_root .. path
            log(string.format("game requested: %s", filename))
            log(string.format("using randomly chosen [%s]: %s", current_seq.name, fname))
            return fname
        end
    end
    -- check choices
    local clist = map.choices[filename]
    if clist and #clist > 0 then
        i = ((i-1) % #clist) + 1
        local path = clist[i]
        fname = content_root .. path
        log(string.format("game requested: %s", filename))
        log(string.format("using randomly chosen: %s", fname))
        return fname
    end
end

function m.key_down(ctx, vkey)
    if vkey == action_reload_map.vkey then
        map = load_map(content_root .. "\\map.ini")
        log_map()
        messages = messages .. "map reloaded\n"
    elseif vkey == action_clear_messages.vkey then
        messages = ""
    end
end

function m.overlay_on(ctx)
    return string.format("%s | Keys: %s - reload map, %s - clear messages\n%s",
        m.version, action_reload_map.label, action_clear_messages.label, messages)
end

function m.init(ctx)
    if content_root:sub(1,1) == '.' then
        content_root = ctx.sider_dir .. content_root
    end
    map = load_map(content_root .. "\\map.ini")
    log_map()
    table_mode_map = load_table_mode_map(content_root .. "\\table_mode.ini")
    log_table_mode_map()

    math.randomseed(os.time())
    ctx.register("set_teams", m.set_teams)
    ctx.register("set_home_team_for_kits", m.set_home_team_for_kits)
    ctx.register("livecpk_get_filepath", m.get_filepath)
    ctx.register("overlay_on", m.overlay_on)
    ctx.register("key_down", m.key_down)

    -- find location for table-mode.bin related structure in memory
    -- 0000000140A7D33D | 48:8B05 84FEC702         | mov rax,qword ptr ds:[1436FD1C8]           | read table_mode.bin - related addr
    -- 0000000140A7D344 | 48:85C0                  | test rax,rax                               |
    -- 0000000140A7D347 | 75 34                    | jne pes2021.140A7D37D                      |
    -- 0000000140A7D349 | C74424 40 19000000       | mov dword ptr ss:[rsp+40],19               |
    -- 0000000140A7D351 | 45:33C0                  | xor r8d,r8d                                |
    -- 0000000140A7D354 | BA 60040000              | mov edx,460                                |
    local addr = memory.search_process("\x75\x34\xc7\x44\x24\x40\x19\x00\x00\x00\x45\x33\xc0")
    if not addr then
        error("unable to find object pointer")
    else
        local offset = memory.unpack("i32", memory.read(addr - 7, 4))
        object_ptr = addr - 3 + offset
        log(string.format("object_ptr: %s", memory.hex(object_ptr)))
    end
end

return m
