-- Menu Server for PES 2021: Assign a menu based on the competition mode
-- Custom content is used, not LiveCPK/game: content\menu-server is the root
-- Author: Hawke & Zlac, 2020
-- Version: 4.0
-- Originally posted on Evo-Web
-- Massive thanks to Zlac... I 100% could not have done this without him, thanks mate

-- local new_menu_path
local menuroot = ".\\content\\menu-server"
local random_num

local competition_assignment_map = {}
local exhib_same_league_tid


-- remove trailing and leading whitespace from string
local function trim(s)
  return s:gsub("^%s*(.-)%s*$", "%1")
end

local function get_common_lib(ctx)
    return ctx.common_lib or _empty
end

local function split(s, inSplitPattern)
   local outResults = {}
   -- chop off the trailing comment, if present
   local theCommentStart = string.find( s, "#", 1 )
   local data = s
   if theCommentStart ~= nil then
      data = string.sub(s, 1, theCommentStart-1)
   end

   -- now do the splits by main separator (inSplitPattern)
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
    local data = assert(io.lines(menuroot .. "\\" .. filename))
    log(filename .. " found in " .. menuroot .. "\\" .. filename)

    for line in data do
       line = trim(string.gsub(line, "^\239\187\191", "")) -- removes UTF BOM bytes at the beginning of the first line in .txt file and leading/trailing whitespaces in every line
       local fields = split(line, delim)
       if #fields > 1 then
	       for i=1,#fields do
	           fields[i] = trim(fields[i])
	       end
	       if fields[1] ~= nil and fields[1] ~= "" then
	          if filename == "map_competitions.txt" and fields[2] ~= nil then
	      	  	 if competition_assignment_map[tonumber(fields[1])] ~= nil then
	      	  	 	table.insert(competition_assignment_map[tonumber(fields[1])], {fields[2]})
	      	  	 else
	      	  	 	competition_assignment_map[tonumber(fields[1])] = { {fields[2]} }
	      	  	 end
	      	  	 log(string.format(" ==> %s menu assignment::   %s: %s ", filename, fields[1], fields[2]))
	      	  end
	       end
	   end
    end
end

local function has_value(tab, val)
    for index, value in ipairs(tab) do
        if value == val then
            return true
        end
    end
    return false
end

function dump_table(o)
   if type(o) == 'table' then
      local s = '{ '
      for k,v in pairs(o) do
         if type(k) ~= 'number' then k = '"'..k..'"' end
         s = s .. '['..k..'] = ' .. dump_table(v) .. ','
      end
      return s .. '} '
   else
      return tostring(o)
   end
end


local function is_edit_mode(ctx)
    -- sorta works now, but probably needs to be more robust
	-- if all three values are known, we should not be in edit mode
    return not(ctx.tournament_id and ctx.home_team and ctx.away_team)
end


local function is_it_menu_file(filename)
    filename = string.lower(filename)
    if
        string.match(filename, "common\\menu\\system") or
        string.match(filename, "common\\menu\\general") or
        string.match(filename, "common\\script\\flow") or
        string.match(filename, "common\\render\\symbol\\blank") or
        string.match(filename, "common\\render\\symbol\\flag")
    then
        return true
    else
        return false
    end
end


local function get_new_menu_path(ctx)
	local tid = tonumber(ctx.tournament_id)
	local menu_path

	if exhib_same_league_tid then
		if competition_assignment_map[exhib_same_league_tid] ~= nil and random_num ~= nil then
			menu_path = competition_assignment_map[exhib_same_league_tid][random_num][1]  -- use the menu assigned for this competition
		end
	elseif tid then
		if competition_assignment_map[tid] ~= nil and random_num ~= nil then
			menu_path = competition_assignment_map[tid][random_num][1]  -- use the menu assigned for this competition
		end
    end
	return menu_path
end


local function teams_selected(ctx, home_team_id, away_team_id)
	--whenever game selects new home_team, pick a random index of a menu to be used in selected competition (e.g. if multiple menus are assigned to one competition_ID)
    local tid = tonumber(ctx.tournament_id)
	random_num = nil
	exhib_same_league_tid = nil

	if tid == 65535 then
        -- are both teams in exhibition mode from the same playable league?
        log("Checking if both teams in exhibition belong to the same league ... ")
		exhib_same_league_tid = get_common_lib(ctx).tid_same_league(home_team_id, away_team_id)
		        
		if exhib_same_league_tid ~= nil then
			log("... they do!")
			log("... mapped TournamentID for exhibition mode: " .. exhib_same_league_tid )
			if competition_assignment_map[exhib_same_league_tid] ~= nil then
				log(string.format("... competition with ID %s has %s menu(s) assigned.", exhib_same_league_tid, #competition_assignment_map[exhib_same_league_tid]))
				if #competition_assignment_map[exhib_same_league_tid] == 1 then
					-- if there's only one menu assigned to competition, set "random" number to 1
					-- do the same if replay mode is active - tid is not reliably available, so assume there's only 1 menu available
					random_num = 1
				else
					-- if there are more menus, select one index rendomly
					-- random_num = math.random(1, #competition_assignment_map[tid])
					random_num = math.random(#competition_assignment_map[exhib_same_league_tid])
				end
				log("Selecting random menu for competition ID " .. tostring(exhib_same_league_tid) .. " in exhibition mode (both teams belong to the same league): Menu no. " .. tostring(random_num) .. " (from " .. tostring(#competition_assignment_map[exhib_same_league_tid]) .. " menu(s) available)")
			else
				log(string.format("... competition with ID %s has no menus assigned.", exhib_same_league_tid))
				-- since the mapped competition does not have its own menus, revert to default exhibition mode random selection
				if competition_assignment_map[tid] ~= nil then
					if #competition_assignment_map[tid] == 1 then
						random_num = 1
					else
						random_num = math.random(#competition_assignment_map[tid])
					end
					log("Selecting random menu for exhibition mode: Menu no. " .. tostring(random_num) .. " (from " .. tostring(#competition_assignment_map[tid]) .. " menu(s) available)")
				end
			end
		else
			log("... they don't!")
            -- if not from the same league, make sure we still generate random_num for exhibition mode ...
            if competition_assignment_map[tid] ~= nil then
                if #competition_assignment_map[tid] == 1 then
                    random_num = 1
                else
                    random_num = math.random(#competition_assignment_map[tid])
                end
                log("Selecting menu for exhibition mode: Menu no. " .. tostring(random_num) .. " (from " .. tostring(#competition_assignment_map[tid]) .. " menu(s) available)")
            end
        end
	--
	elseif competition_assignment_map[tid] ~= nil then
		-- if #competition_assignment_map[tid] == 1 or ctx.is_replay_gallery == true then
        if #competition_assignment_map[tid] == 1 then
			random_num = 1
		else
            random_num = math.random(#competition_assignment_map[tid])
		end
		log("Selecting random menu for competition ID " .. tostring(tid) .. ": menu no. " .. tostring(random_num) .. " (from " .. tostring(#competition_assignment_map[tid]) .. " menu(s) available)")
	end
end


local function make_key(ctx, filename)
	-- if ctx.is_edit_mode == nil then -- do something only if edit mode is NOT active
		-- local menu_fname = which_menu(filename)
		-- if is_it_menu_file(filename) then
		if not is_edit_mode(ctx) and is_it_menu_file(filename) then
              -- log(string.format("Into make_key (menu file) ... (%s)", filename))
		      local new_menu_path = get_new_menu_path(ctx)
		      if new_menu_path then
                 -- log("Into make_key (menu file): " .. new_menu_path .. "\\" .. filename)
		      	 return new_menu_path .. "\\" .. filename
		      end
		end

	-- end
end


local function nil2str(value)
	if value ~= nil then
		return value
	else
		return "N/A"
	end
end


local function get_filepath(ctx, filename, key)
    -- log(string.format("Into get_filepath ... (%s, %s)", filename, key))
	-- if ctx.is_edit_mode == nil then -- do something only if edit mode is NOT active
		if key and filename and filename ~= key then -- filename ~= key shoud ensure that it really is a file from custom repository, with modified path prefix???
			-- log(string.format("menu file assignment for competition ID %s - %s\\%s", nil2str(ctx.tournament_id), menuroot, key))
			-- log(string.format("%s\\%s", menuroot, key))
			return string.format("%s\\%s", menuroot, key)
		end
	-- end
end


local function init(ctx)
    if menuroot:sub(1,1)=='.' then
        menuroot = ctx.sider_dir .. menuroot
    end
    load_map_txt("map_competitions.txt")
	math.randomseed(os.time())
	
    ctx.register("livecpk_make_key", make_key)
    ctx.register("livecpk_get_filepath", get_filepath)
    ctx.register("set_teams", teams_selected)
end

return { init = init }