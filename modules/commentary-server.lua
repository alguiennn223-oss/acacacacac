--[[
=========================
CommentaryServer module and Game research by: juce and nesa24
Requires: sider.dll 7.0.2.0+
Requires GameVersion 1.3.0
=========================
--]]

local m = { version = "0.2" }

local patterns = {
    "sound\\awb\\00_TEAM.awb",
    "sound\\awb\\10_PLAYER.awb",
    "sound\\awb\\20_MAIN.awb",
    "sound\\awb\\30_MAIN.awb",
    "sound\\awb\\40_MAIN.awb",
    "sound\\acb\\00_TEAM.acb",
    "sound\\acb\\10_PLAYER.acb",
    "sound\\acb\\20_MAIN.acb",
    "sound\\acb\\30_MAIN.acb",
    "sound\\acb\\40_MAIN.acb",
    "sound\\config\\Rc\\rc_config.bin",
    "sound\\config\\Control\\ng_list.xml",
    "sound\\config\\Control\\tree_control.xml",
}

local content_root
local curr_lang
local structure_addr


local teams_assignment_map = {}


local function trim(s)
  return s:gsub("^%s*(.-)%s*$", "%1")
end



local function split(s, inSplitPattern)
   local outResults = {}
   local theCommentStart = string.find( s, "#", 1 )
   local data = s
   if theCommentStart ~= nil then
      data = string.sub(s, 1, theCommentStart-1)
   end

   local theStart = 1
   local theSplitStart, theSplitEnd = string.find( data, inSplitPattern, theStart )
   while theSplitStart do
      outResults[#outResults+1] = trim(string.sub( data, theStart, theSplitStart-1 ))
      theStart = theSplitEnd + 1
      theSplitStart, theSplitEnd = string.find( data, inSplitPattern, theStart )
   end
   outResults[#outResults+1] = trim(string.sub( data, theStart ))
   return outResults
end




local function load_map_txt(filename)
    local delim = ","
    local data = assert(io.lines(content_root .. "\\" .. filename))
    for line in data do
	   local fields = split(line, delim)
       if #fields > 1 then	      
	       if fields[1] ~= nil and fields[1] ~= "" then
	          if fields[2] ~= nil then
	      	  	 if teams_assignment_map[tonumber(fields[1])] ~= nil then
	      	  	 	table.insert(teams_assignment_map[tonumber(fields[1])], {fields[2]})
	      	  	 else
	      	  	 	teams_assignment_map[tonumber(fields[1])] = { {fields[2]} }
	      	  	 end
	      	  end
	       end
	   end
    end
end


local function has_value(tab, val)
    for key, value in pairs(tab) do
        if val == key then
		    curr_lang = tostring(value[1][1])
            return true
        end
    end
    return false
end


function m.get_filepath(ctx, filename, key)
    for i,pattern in ipairs(patterns) do
        if string.match(filename, pattern) then
            if not curr_lang then
                log(string.format("****** using: %s", filename))
                return
            end
            local s = content_root .. string.format("%s\\%s", curr_lang, pattern)
            log(string.format("****** using: %s --> %s", filename, s))
            return s
        end
    end
end

function m.set_teams(ctx, home, away)
            if has_value(teams_assignment_map, ctx.home_team) 
			then
			else
			     curr_lang = nil
			end

    -- force ACB reload
    local addr = memory.unpack("u64", memory.read(structure_addr, 4))
    memory.write(addr + 0x94, "\x08")
end

function m.init(ctx)

   
    
    content_root = ctx.sider_dir .. "content\\commentary-server\\"             -- set root folder
	load_map_txt("commentary-server.txt")                                      -- load team map
    ctx.register("set_teams", m.set_teams)                                     -- set check team map procedure
    ctx.register("livecpk_get_filepath", m.get_filepath)                       -- FUCK IT IF NOT NIL

    --[[
    0000000140C5672D | 45:0FB6F6                | movzx r14d,r14b                            |
    0000000140C56731 | 83F8 13                  | cmp eax,13                                 |
    0000000140C56734 | 45:0F44F4                | cmove r14d,r12d                            |
    0000000140C56738 | 48:8B0D 5198AA02         | mov rcx,qword ptr ds:[1436FFF90]           |
    --]]
    local pos = memory.search_process("\x45\x0f\xb6\xf6\x83\xf8\x13\x45\x0f\x44\xf4\x48\x8b\x0d")
    if not pos then
        error("unable to find data-structure address")
    end
    pos = pos + 14
    local offset = memory.unpack("i32", memory.read(pos, 4))
    structure_addr = pos + 4 + offset
    log(string.format("structure address: %s", memory.hex(structure_addr)))
end

return m
