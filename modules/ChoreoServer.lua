--ChoreoServer.lua modulo Para Choreos (solo estadios by Jostike Games)

local fileroot = ".\\content\\Choreo"

local function make_key(ctx, filename)

--Spanish Teams

--Real Madrid vs ATL
    if ctx.home_team == 109 and ctx.away_team == 172 then
        Choreo = "Teams\\Spain\\Real Madrid"
--Real Madrid vs FCB
elseif ctx.home_team == 109 and ctx.away_team == 108 then
	Choreo = "Teams\\Spain\\Real Madrid"

--Atletico Madrid vs RMA
elseif ctx.home_team == 172 and ctx.away_team == 109 then
        Choreo = "Teams\\Spain\\Atletico Madrid"

--FC Barcelona vs ESP
elseif ctx.home_team == 108 and ctx.away_team == 259 then
	Choreo = "Teams\\Spain\\Barcelona"
--FC Barcelona vs RMA
elseif ctx.home_team == 108 and ctx.away_team == 109 then
	Choreo = "Teams\\Spain\\Barcelona"

--Espanyol vs FCB
elseif ctx.home_team == 259 and ctx.away_team == 108 then
	Choreo = "Teams\\Spain\\Espanyol"

--Sevilla vs BET
elseif ctx.home_team == 265 and ctx.away_team == 194 then
	Choreo = "Teams\\Spain\\Sevilla"

--Real Betis vs SEV
elseif ctx.home_team == 194 and ctx.away_team == 265 then
	Choreo = "Teams\\Spain\\Real Betis"

--Granada vs MAL
elseif ctx.home_team == 1765 and ctx.away_team == 260 then
	Choreo = "Teams\\Spain\\Granada"

--Valencia vs LEV
elseif ctx.home_team == 110 and ctx.away_team == 366 then
	Choreo = "Teams\\Spain\\Valencia"

--Levante vs VAL
elseif ctx.home_team == 366 and ctx.away_team == 110 then
	Choreo = "Teams\\Spain\\Levante"

--Leganés vs GET
elseif ctx.home_team == 4272 and ctx.away_team == 362 then
	Choreo = "Teams\\Spain\\Leganes"

--Getafe vs LGN
elseif ctx.home_team == 362 and ctx.away_team == 4272 then
	Choreo = "Teams\\Spain\\Getafe"

--Real Sociedad vs ATH
elseif ctx.home_team == 196 and ctx.away_team == 258 then
	Choreo = "Teams\\Spain\\Real Sociedad"

--Athletic Club vs RSO
elseif ctx.home_team == 258 and ctx.away_team == 196 then
	Choreo = "Teams\\Spain\\Athletic Club"

--Las Palmas vs TEN
elseif ctx.home_team == 364 and ctx.away_team == 4147 then
	Choreo = "Teams\\Spain\\Las Palmas"


--German Teams

--Bayern Munich vs BVB
elseif ctx.home_team == 127 and ctx.away_team == 126 then
	Choreo = "Teams\\Germany\\Bayern Munich"
--Bayern Munich vs STU
elseif ctx.home_team == 127 and ctx.away_team == 231 then
	Choreo = "Teams\\Germany\\Bayern Munich"

--Borussia Dortmund vs BAY
elseif ctx.home_team == 126 and ctx.away_team == 127 then
	Choreo = "Teams\\Germany\\Borussia Dortmund"
--Borussia Dortmund vs S04
elseif ctx.home_team == 126 and ctx.away_team == 184 then
	Choreo = "Teams\\Germany\\Borussia Dortmund"
--Borussia Dortmund vs BMG
elseif ctx.home_team == 126 and ctx.away_team == 225 then
	Choreo = "Teams\\Germany\\Borussia Dortmund"

--Borussia Monchengladbach vs FCK
elseif ctx.home_team == 225 and ctx.away_team == 4137 then
	Choreo = "Teams\\Germany\\Borussia Monchengladbach"
--Borussia Monchengladbach vs BVB
elseif ctx.home_team == 225 and ctx.away_team == 126 then
	Choreo = "Teams\\Germany\\Borussia Monchengladbach"

--FC Koln vs BMG
elseif ctx.home_team == 4137 and ctx.away_team == 225 then
	Choreo = "Teams\\Germany\\FC Koln"

--Union Berlin vs BSC
elseif ctx.home_team == 4140 and ctx.away_team == 4125 then
	Choreo = "Teams\\Germany\\Union Berlin"

--Hertha Berlin vs UBR
elseif ctx.home_team == 4125 and ctx.away_team == 4140 then
	Choreo = "Teams\\Germany\\Hertha Berlin"

--Schalke vs BVB
elseif ctx.home_team == 184 and ctx.away_team == 126 then
        Choreo = "Teams\\Germany\\Schalke"


--Englans Teams

--Tottenham vs ARS
elseif ctx.home_team == 179 and ctx.away_team == 101 then
        Choreo = "Teams\\England\\Tottenham"

--Arsenal vs TOT
elseif ctx.home_team == 101 and ctx.away_team == 179 then
        Choreo = "Teams\\England\\Arsenal"
--Arsenal vs CHE
elseif ctx.home_team == 101 and ctx.away_team == 102 then
        Choreo = "Teams\\England\\Arsenal" 
--Arsenal vs MUN
elseif ctx.home_team == 101 and ctx.away_team == 100 then
        Choreo = "Teams\\England\\Arsenal" 

               
--Manchester City vs MUN        
elseif ctx.home_team == 173 and ctx.away_team == 100 then
        Choreo = "Teams\\England\\Manchester City" 
        
--Liverpool vs EVE
elseif ctx.home_team == 103 and ctx.away_team == 177 then
	Choreo = "Teams\\England\\Liverpool"
--Liverpool vs MUN	
elseif ctx.home_team == 103 and ctx.away_team == 100 then
	Choreo = "Teams\\England\\Liverpool"

--Everton vs LIV
elseif ctx.home_team == 177 and ctx.away_team == 103 then
	Choreo = "Teams\\England\\Everton"
	
--Manchester United vs MCI
elseif ctx.home_team == 100 and ctx.away_team == 173 then    	
	Choreo = "Teams\\England\\Manchester United"		 	   	
--Manchester United vs LIV
elseif ctx.home_team == 100 and ctx.away_team == 103 then    	
	Choreo = "Teams\\England\\Manchester United"
--Manchester United vs ARS
elseif ctx.home_team == 100 and ctx.away_team == 101 then    	
	Choreo = "Teams\\England\\Manchester United"

--Chelsea vs ARS		 	   	
elseif ctx.home_team == 102 and ctx.away_team == 101 then    	
	Choreo = "Teams\\England\\Chelsea"
--Chelsea vs FUL		 	   	
elseif ctx.home_team == 102 and ctx.away_team == 178 then    	
	Choreo = "Teams\\England\\Chelsea"

--Fulham vs CHE		 	   	
elseif ctx.home_team == 178 and ctx.away_team == 102 then    	
	Choreo = "Teams\\England\\Fulham"

--Leeds vs MUN
elseif ctx.home_team == 104 and ctx.away_team == 100 then    	
	Choreo = "Teams\\England\\Leeds"
--Leeds vs HUD
elseif ctx.home_team == 104 and ctx.away_team == 2610 then    	
	Choreo = "Teams\\England\\Leeds"


--Aston Villa vs BIR		 	   	
elseif ctx.home_team == 107 and ctx.away_team == 201 then    	
	Choreo = "Teams\\England\\Aston Villa"

--Newcastle vs SUN		 	   	
elseif ctx.home_team == 106 and ctx.away_team == 396 then    	
	Choreo = "Teams\\England\\Newcastle"

--Wolverhampton vs WBA		 	   	
elseif ctx.home_team == 208 and ctx.away_team == 399 then    	
	Choreo = "Teams\\England\\Wolverhampton"

--West Bromvich Albion vs WOL		 	   	
elseif ctx.home_team == 399 and ctx.away_team == 208 then    	
	Choreo = "Teams\\England\\West Bromvich Albion"

--West Ham United vs MIL		 	   	
elseif ctx.home_team == 105 and ctx.away_team == 387 then    	
	Choreo = "Teams\\England\\West Ham United"


--Italian Teams

--Roma vs LAZ
elseif ctx.home_team == 125 and ctx.away_team == 122 then
        Choreo = "Teams\\Italy\\Roma"
--Roma vs NAP        
elseif ctx.home_team == 125 and ctx.away_team == 327 then
        Choreo = "Teams\\Italy\\Roma"

--Lazio vs ROM
elseif ctx.home_team == 122 and ctx.away_team == 125 then
        Choreo = "Teams\\Italy\\Lazio"   
             
--Inter vs ACM
elseif ctx.home_team == 119 and ctx.away_team == 121 then
        Choreo = "Teams\\Italy\\Inter"
--Inter vs JUV
elseif ctx.home_team == 119 and ctx.away_team == 120 then
        Choreo = "Teams\\Italy\\Inter"

--AC Milan vs INT               
elseif ctx.home_team == 121 and ctx.away_team == 119 then
        Choreo = "Teams\\Italy\\AC Milan"
--AC Milan vs JUV               
elseif ctx.home_team == 121 and ctx.away_team == 120 then
        Choreo = "Teams\\Italy\\AC Milan"

--Juventus vs INT        
elseif ctx.home_team == 120 and ctx.away_team == 119 then      
	Choreo = "Teams\\Italy\\Juventus"
--Juventus vs ACM        
elseif ctx.home_team == 120 and ctx.away_team == 121 then      
	Choreo = "Teams\\Italy\\Juventus"
--Juventus vs TOR        
elseif ctx.home_team == 120 and ctx.away_team == 333 then      
	Choreo = "Teams\\Italy\\Juventus"

--Napoli vs ROM		
elseif ctx.home_team == 327 and ctx.away_team == 125 then      
	Choreo = "Teams\\Italy\\Napoli"


--Netherlands Teams

--Ajax vs FEY
elseif ctx.home_team == 116 and ctx.away_team == 117 then
        Choreo = "Teams\\Netherlands\\Ajax"

--Feyenoord vs AJA panga   
elseif ctx.home_team == 117 and ctx.away_team == 116 then
        Choreo = "Teams\\Netherlands\\Feyenoord"


--French Teams

--PSG vs OM
elseif ctx.home_team == 114 and ctx.away_team == 113 then
         Choreo = "Teams\\France\\PSG"

--Olympique Marseille vs PSG         
elseif ctx.home_team == 113 and ctx.away_team == 114 then
         Choreo = "Teams\\France\\Olympique Marseille"
--Olympique Marseille vs OLY         
elseif ctx.home_team == 113 and ctx.away_team == 181 then
         Choreo = "Teams\\France\\Olympique Marseille"

--Olympique Lyonnais vs OM
elseif ctx.home_team == 181 and ctx.away_team == 113 then
         Choreo = "Teams\\France\\Olympique Lyonnais"
--Olympique Lyonnais vs SAE
elseif ctx.home_team == 181 and ctx.away_team == 418 then
         Choreo = "Teams\\France\\Olympique Lyonnais"

--Monaco vs NIC
elseif ctx.home_team == 112 and ctx.away_team == 217 then
         Choreo = "Teams\\France\\Monaco" 
  
--Nice vs MON
elseif ctx.home_team == 217 and ctx.away_team == 112 then
         Choreo = "Teams\\France\\Nice"                

--Lens vs LIL
elseif ctx.home_team == 182 and ctx.away_team == 213 then
         Choreo = "Teams\\France\\Lens"                


--Deanish Teams

--Copenhagen vs BNY
elseif ctx.home_team == 1207 and ctx.away_team == 1832 then
         Choreo = "Teams\\Denmark\\Copenhagen"

--Brondby vs KOB
elseif ctx.home_team == 1832 and ctx.away_team == 1207 then
         Choreo = "Teams\\Denmark\\Brondby"


--Portuguese Teams

--Porto vs BEN
elseif ctx.home_team == 192 and ctx.away_team == 191 then
         Choreo = "Teams\\Portugal\\Porto"
--Porto vs SCP
elseif ctx.home_team == 192 and ctx.away_team == 193 then
         Choreo = "Teams\\Portugal\\Porto"
--Porto vs BOA
elseif ctx.home_team == 192 and ctx.away_team == 4323 then
         Choreo = "Teams\\Portugal\\Porto"

--Benfica vs POR
elseif ctx.home_team == 191 and ctx.away_team == 192 then
         Choreo = "Teams\\Portugal\\Benfica"
--Benfica vs SCP
elseif ctx.home_team == 191 and ctx.away_team == 193 then
         Choreo = "Teams\\Portugal\\Benfica"


--Russian Teams

--Dinamo Moskva vs SPA
elseif ctx.home_team == 1753 and ctx.away_team == 135 then
         Choreo = "Teams\\Russia\\Dinamo Moskva"

--Spartak Moskva vs DIN
elseif ctx.home_team == 135 and ctx.away_team == 1753 then
         Choreo = "Teams\\Russia\\Spartak Moskva"





--Scotish Teams

--Celtic vs RAN
elseif ctx.home_team == 131 and ctx.away_team == 132 then
         Choreo = "Teams\\Scotland\\Celtic"

--Rangers vs CEL
elseif ctx.home_team == 132 and ctx.away_team == 131 then
         Choreo = "Teams\\Scotland\\Rangers"


--Switzerland Teams

--Basel vs ZUR
elseif ctx.home_team == 1706 and ctx.away_team == 1957 then
         Choreo = "Teams\\Switzerland\\Basel"  


--Turkish Teams

--Galatasaray vs FBC
elseif ctx.home_team == 130 and ctx.away_team == 197 then
        Choreo = "Teams\\Turkey\\Galatasaray"

--Fenerbahce vs GLT
elseif ctx.home_team == 197 and ctx.away_team == 130 then
        Choreo = "Teams\\Turkey\\Fenerbahce"

--Trabzonspor vs BSK
elseif ctx.home_team == 1945 and ctx.away_team == 273 then
        Choreo = "Teams\\Turkey\\Trabzonspor"        


--Argentina Teams

--River Plate vs BOC
elseif ctx.home_team == 138 and ctx.away_team == 139 then    
	Choreo = "Teams\\Argentina\\River"

--Boca Juniors vs RIV	     
elseif ctx.home_team == 139 and ctx.away_team == 138 then    	
	Choreo = "Teams\\Argentina\\Boca Juniors"


--Brazilian Teams

--Flamengo vs VSC    	
elseif ctx.home_team == 1248 and ctx.away_team == 136 then    	
	Choreo = "Teams\\Brazil\\Flamengo"
--Flamengo vs COR    	
elseif ctx.home_team == 1248 and ctx.away_team == 1247 then    	
	Choreo = "Teams\\Brazil\\Flamengo"
--Flamengo vs CAM    	
elseif ctx.home_team == 1248 and ctx.away_team == 1245 then    	
	Choreo = "Teams\\Brazil\\Flamengo"
--Flamengo vs FLU    	
elseif ctx.home_team == 1248 and ctx.away_team == 1249 then    	
	Choreo = "Teams\\Brazil\\Flamengo"
--Flamengo vs BOT    	
elseif ctx.home_team == 1248 and ctx.away_team == 1246 then    	
	Choreo = "Teams\\Brazil\\Flamengo"

--Fluminense vs FLA    	
elseif ctx.home_team == 1249 and ctx.away_team == 1248 then    	
	Choreo = "Teams\\Brazil\\Fluminense"
--Fluminense vs BOT    	
elseif ctx.home_team == 1249 and ctx.away_team == 1246 then    	
	Choreo = "Teams\\Brazil\\Fluminense"
--Fluminense vs BOT    	
elseif ctx.home_team == 1249 and ctx.away_team == 136 then    	
	Choreo = "Teams\\Brazil\\Fluminense"

--Botafogo vs FLU    	
elseif ctx.home_team == 1246 and ctx.away_team == 1249 then    	
	Choreo = "Teams\\Brazil\\Botafogo"
--Botafogo vs FLA    	
elseif ctx.home_team == 1246 and ctx.away_team == 1248 then    	
	Choreo = "Teams\\Brazil\\Botafogo"
--Botafogo vs VSC    	
elseif ctx.home_team == 1246 and ctx.away_team == 136 then    	
	Choreo = "Teams\\Brazil\\Botafogo"

--Vasco da Gama vs BOT
elseif ctx.home_team == 136 and ctx.away_team == 1246 then    	
	Choreo = "Teams\\Brazil\\Vasco da Gama"
--Vasco da Gama vs FLA
elseif ctx.home_team == 136 and ctx.away_team == 1248 then    	
	Choreo = "Teams\\Brazil\\Vasco da Gama"
--Vasco da Gama vs FLU
elseif ctx.home_team == 136 and ctx.away_team == 1249 then    	
	Choreo = "Teams\\Brazil\\Vasco da Gama"

--Atlético Mineiro vs FLA
elseif ctx.home_team == 1245 and ctx.away_team == 1248 then    	
	Choreo = "Teams\\Brazil\\Atleticomg"
--Atlético Mineiro vs CRU
elseif ctx.home_team == 1245 and ctx.away_team == 274 then    	
	Choreo = "Teams\\Brazil\\Atleticomg"

--Cruzeiro vs CAM
elseif ctx.home_team == 274 and ctx.away_team == 1245 then    	
	Choreo = "Teams\\Brazil\\Cruzeiro"

--Corinthians vs PAL		 
elseif ctx.home_team == 1247 and ctx.away_team == 137 then
        Choreo = "Teams\\Brazil\\Corinthians"
--Corinthians vs FLA		 
elseif ctx.home_team == 1247 and ctx.away_team == 1248 then
        Choreo = "Teams\\Brazil\\Corinthians"
--Corinthians vs SPA		 
elseif ctx.home_team == 1247 and ctx.away_team == 1255 then
        Choreo = "Teams\\Brazil\\Corinthians"
--Corinthians vs SAN		 
elseif ctx.home_team == 1247 and ctx.away_team == 1254 then
        Choreo = "Teams\\Brazil\\Corinthians"

--Santos vs COR
elseif ctx.home_team == 1254 and ctx.away_team == 1247 then
        Choreo = "Teams\\Brazil\\Santos"
--Santos vs SPA
elseif ctx.home_team == 1254 and ctx.away_team == 1255 then
        Choreo = "Teams\\Brazil\\Santos"
--Santos vs PAL
elseif ctx.home_team == 1254 and ctx.away_team == 137 then
        Choreo = "Teams\\Brazil\\Santos"

--Sao Paulo vs COR
elseif ctx.home_team == 1255 and ctx.away_team == 1247 then
        Choreo = "Teams\\Brazil\\Sao Paulo"
--Sao Paulo vs PAL
elseif ctx.home_team == 1255 and ctx.away_team == 137 then
        Choreo = "Teams\\Brazil\\Sao Paulo"
--Sao Paulo vs SAN
elseif ctx.home_team == 1255 and ctx.away_team == 1254 then
        Choreo = "Teams\\Brazil\\Sao Paulo"

--Palmeiras vs COR		 
elseif ctx.home_team == 137 and ctx.away_team == 1247 then
        Choreo = "Teams\\Brazil\\Palmeiras"
--Palmeiras vs SPA		 
elseif ctx.home_team == 137 and ctx.away_team == 1255 then
        Choreo = "Teams\\Brazil\\Palmeiras"
--Palmeiras vs SAN		 
elseif ctx.home_team == 137 and ctx.away_team == 1254 then
        Choreo = "Teams\\Brazil\\Palmeiras"

--Atletico Paranaense vs CUR		 
elseif ctx.home_team == 1930 and ctx.away_team == 1931 then
        Choreo = "Teams\\Brazil\\Atletico Paranaense"

--Gremio vs SCI
elseif ctx.home_team == 1250 and ctx.away_team == 1252 then
        Choreo = "Teams\\Brazil\\Gremio"

--Internacional Porto Alegre vs GRE
elseif ctx.home_team == 1252 and ctx.away_team == 1250 then
        Choreo = "Teams\\Brazil\\Internacional Porto Alegre"

--América Mineiro vs CAM
elseif ctx.home_team == 2450 and ctx.away_team == 1245 then
        Choreo = "Teams\\Brazil\\América Mineiro"

--Ceará vs FOR
elseif ctx.home_team == 2454 and ctx.away_team == 5143 then
        Choreo = "Teams\\Brazil\\Ceará"

--Fortaleza vs CEA
elseif ctx.home_team == 5143 and ctx.away_team == 2454 then
        Choreo = "Teams\\Brazil\\Fortaleza"

--EC Bahía vs VIT
elseif ctx.home_team == 2453 and ctx.away_team == 1937 then
        Choreo = "Teams\\Brazil\\EC Bahía"
		
	else
        Choreo = nil
    end
    if Choreo ~= nil then
        return string.format("%s:%s", Choreo, filename)
    end
end

local function get_filepath(ctx, filename, key)
    if key and Choreo ~= nil then
        return string.format("%s\\%s\\%s", fileroot, Choreo, filename)
    end
end

function make_log(ctx)
    if Choreo ~= ni then
       logResult = Choreo
       logResult = string.gsub(logResult, "Teams\\", "")
       log("-------- " .. logResult)
    end
end

local function init(ctx)
    if fileroot:sub(1,1)=='.' then
        fileroot = ctx.sider_dir .. fileroot
    end
    ctx.register("trophy_rewrite", make_log)
    ctx.register("livecpk_make_key", make_key)
    ctx.register("livecpk_get_filepath", get_filepath)
end

return { init = init }


