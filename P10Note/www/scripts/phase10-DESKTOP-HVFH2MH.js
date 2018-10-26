$(document).ready(function () {
    
    var players = new Array();
    var rounds  = new Array();
    
    var phases  = new Array();

    var devMode = false;

    if(devMode == true)
    {
        $('#game-settings-wrapper').show(500);
        $('#player-settings-wrapper').show(500);
        $('#game-card-setting-wrapper').show(500);
        $('#edit-round-wrapper').show(500);
        $('#finish-form').show(500);
        $('#game-field-wrapper').show(500);
    }

    generatePhaseCards();
    
    //Anzahl der Spieler festlegen
    $('#set-num-players-button').click(function () {
        
        var num_players;
        var i;

        num_players = $('#num-players').val();

        if (num_players > 1)
        {
            for (i = num_players - 1; i >= 0; i--)
            {
                $('#player-name-input-wrapper').prepend("<div><div class='is-dealer left'><input type='checkbox' id='is-dealer-" + i + "' class='player-is-dealer'></div><div class='player-name-input-text left'><input type='text' class='player-name-input' id='player-name-" + i + "' placeholder='Spieler " + (i + 1) + "'></div><div class='clearfix'></div></div>");
            }
            
            if(devMode == false)
            {
                $('#game-settings-wrapper').hide(500);
                $('#player-settings-wrapper').show(500);
            }

        }
        else
        {
            console.log("Es müssen mindestens 2 Spieler am Spiel teilnehmen.");
        }

    });

    $('#choose-card-next-btn').click(function(){
        if(devMode == false)
        {
            $('#player-settings-wrapper').hide(500);
            $('#game-card-setting-wrapper').show(500);
        }
    });
    
    //Spielerinformationen erzeugen (Neues Spiel starten)
    $('#start-game-btn').click(function () {
        setPlayerNames();        
        $('#game-control-wrapper').css('visibility', 'visible');
        
        if(devMode == false)
        {
            $('#game-card-setting-wrapper').hide(500);
            $('#game-field-wrapper').show(500);
        }
    });
    
    $('#close-card').click(function () {        
        $('#phase-card-wrapper').hide(500);
    });
    
    function generatePhaseCards()
    {
        phases[0] = new Array();
        phases[0]["name"] = "Classic";
        phases[0]["phase"] = new Array();
        phases[0]["phase"][0] = "Zwei Drillinge";
        phases[0]["phase"][1] = "Drilling + Viererfolge";
        phases[0]["phase"][2] = "Vierling + Vierfolge";
        phases[0]["phase"][3] = "Siebenerfolge";
        phases[0]["phase"][4] = "Achterfolge";
        phases[0]["phase"][5] = "Neunerfolge";
        phases[0]["phase"][6] = "Zwei Vierlinge";
        phases[0]["phase"][7] = "Sieben Karten einer Farbe";
        phases[0]["phase"][8] = "Fünfling + Zwilling";
        phases[0]["phase"][9] = "Fünfling + Drilling";

        phases[1] = new Array();
        phases[1]["name"] = "Island Paradise";
        phases[1]["phase"] = new Array();
        phases[1]["phase"][0] = "Siebenerfolge";
        phases[1]["phase"][1] = "Zwilling + zwei Dillinge";
        phases[1]["phase"][2] = "Secherfolge + Zwilling";
        phases[1]["phase"][3] = "Zwei Zwillinge + Drilling";
        phases[1]["phase"][4] = "Sechserfolge + Drilling";
        phases[1]["phase"][5] = "Zwei Viererfolgen";
        phases[1]["phase"][6] = "Drei Karten einer Farbe + Vierling";
        phases[1]["phase"][7] = "Acht Karten einer Farbe";
        phases[1]["phase"][8] = "Vier Karten einer Farbe + Fünfling";
        phases[1]["phase"][9] = "Neun Karten einer Farbe";

        phases[2] = new Array();
        phases[2]["name"] = "Cocoa Canyon";
        phases[2]["phase"] = new Array();
        phases[2]["phase"][0] = "Sechs Karten einer Farbe";
        phases[2]["phase"][1] = "Sieben Karten einer Farbe";
        phases[2]["phase"][2] = "Vier Karten einer Farbe + Fünf Karten einer Farbe";
        phases[2]["phase"][3] = "Zwei Drillinge";
        phases[2]["phase"][4] = "Achterfolge";
        phases[2]["phase"][5] = "Neunerfolge";
        phases[2]["phase"][6] = "Vierling + Viererfolge";
        phases[2]["phase"][7] = "Folge aus sechs geraden oder ungeraden Karten";
        phases[2]["phase"][8] = "Vierling + Sechserfolge";
        phases[2]["phase"][9] = "Fünfling + Viererfolge";

        phases[3] = new Array();
        phases[3]["name"] = "Moonlight Drive-in";
        phases[3]["phase"] = new Array();
        phases[3]["phase"][0] = "Vierling + Zwilling";
        phases[3]["phase"][1] = "Zwei Drillinge";
        phases[3]["phase"][2] = "Siebenerfolge";
        phases[3]["phase"][3] = "Achterfolge";
        phases[3]["phase"][4] = "Zwilling + 2 Drillinge";
        phases[3]["phase"][5] = "Fünfling";
        phases[3]["phase"][6] = "Neunerfolge";
        phases[3]["phase"][7] = "Sechserfolge + Zwei Zwillinge";
        phases[3]["phase"][8] = "Achterfolge + Zwilling";
        phases[3]["phase"][9] = "Sechserfolge + Vierling";

        phases[4] = new Array();
        phases[4]["name"] = "Savannah Sunset";
        phases[4]["phase"] = new Array();
        phases[4]["phase"][0] = "3 Karten einer Farbe + 3 Karten einer Farbe + 4 Karten einer Farbe";
        phases[4]["phase"][1] = "Dreierfolge in einer Farbe + Zwei Zwillinge";
        phases[4]["phase"][2] = "Sieben Karten einer Farbe";
        phases[4]["phase"][3] = "Zwei Drillinge";
        phases[4]["phase"][4] = "Zwilling + Zwei Drillinge";
        phases[4]["phase"][5] = "Fünfling";
        phases[4]["phase"][6] = "4 gerade oder ungerade Karten einer Fabe + 4 gerade oder ungerade Karten einer Fabe";
        phases[4]["phase"][7] = "Neunerfolge";
        phases[4]["phase"][8] = "Fünferfolge in einer Farbe + Zwei Zwillinge";
        phases[4]["phase"][9] = "Sechserfolge in einer Farbe + Zwilling";

        phases[5] = new Array();
        phases[5]["name"] = "Mountain Vista";
        phases[5]["phase"] = new Array();
        phases[5]["phase"][0] = "Dreierfolge + Drei Zwillinge";
        phases[5]["phase"][1] = "Achterfolge";
        phases[5]["phase"][2] = "Neunerfolge";
        phases[5]["phase"][3] = "Dreierfolge in einer Farbe + Drilling";
        phases[5]["phase"][4] = "Zwilling + Zwei Drillinge";
        phases[5]["phase"][5] = "Zwilling + Drilling + Vierling";
        phases[5]["phase"][6] = "Vier Karten einer Farbe + Sechs Karten einer Farbe";
        phases[5]["phase"][7] = "Fünf Karten einer Farbe + Fünf Karten einer Farbe";
        phases[5]["phase"][8] = "Fünferfolge + Drilling + Zwilling";
        phases[5]["phase"][9] = "Dreierfolge + Vierling + Drilling";
        
        
        var num_cards = phases.length;
        
        for(i=num_cards-1; i>=0; i--)
        {
            $('#gamecards-wrapper').prepend("<div class=\"phase-card-choose\" data-card-id=\""+ i +"\"><div class=\"phase-name left\">"+ phases[i]["name"] +"</div><div class=\"show-card right\">i</div><div class=\"clearfix\"></div></div>");
        }
    }
    
    function createPhaseCard(cardId, phaseId = -1)
    {
        num_phases = phases[cardId]["phase"].length;
        
        $('#phase-card').html("");
        
        for(i=0; i<num_phases; i++)
        {
            var phaseDone = (phaseId != -1 && i < phaseId-1) ? " phase-done" : "";
            var phaseActive = (phaseId != -1 && i == phaseId-1) ? " phase-active" : "";
            
            $('#phase-card').append("<tr class=\"phase-line\"><td class=\"phase-line-num"+phaseDone + phaseActive+"\">"+(i+1)+".)</td><td class=\"phase-line-desc"+phaseDone + phaseActive+"\">"+phases[cardId]["phase"][i]+"</td></tr>");    
        }
        $('#phase-card-wrapper').show(500);
    }
    
    $('.show-card').click(function(){
        cardId = $(this).parent().attr('data-card-id');
        $('#phase-card-id').val(cardId);
        createPhaseCard(cardId);
    });
    
    $('.phase-card-choose').click(function(){
        cardId = $(this).attr('data-card-id');
        $('#phase-card-id').val(cardId);
        checkPhaseSelection();
        $(this).addClass('phase-selected')
    });
    
    $('#phase-card-viewer').click(function(){
        cardId = $('#phase-card-id').val();
        createPhaseCard(cardId);
    });
    
    function checkPhaseSelection()
    {
        var cards = $('.phase-card-choose');
        
        $.each(cards, function(index, value){
            
            if($(this).hasClass('phase-selected'))
            {
                $(this).removeClass('phase-selected');
            }
        });
    }
 
    function setPlayerNames()
    {
        var num_players = 0;
        
        num_players = $('#num-players').val();
        
        for (i = 0; i < num_players; i++)
        {
            player_name = $('#player-name-' + i).val();

            if (player_name == "") 
            {
                player_name = $('#player-name-' + i).attr("placeholder");
            }
            
            console.info("player");
            
            players[i] = new Array();
            players[i]["name"] = player_name;
            players[i]["points"] = 0;
            players[i]["last_points"] = 0;
            players[i]["phase"] = 1;
            players[i]["rounds"] = new Array(); //Hier werden alle gespielten Runden gespeichert
            players[i]["dealer"] = ($('#is-dealer-'+i).is(':checked') == true) ? true : false;
            
            

            $('#player-info-wrapper').append("<tr class=\"table-row\" id=\"playerinfo_header_" + i + "\"><td class=\"table-cell\" id=\"player-name-" + i + "\">" + players[i]["name"] + "</td><td class=\"table-cell player-phase center-align\" id=\"player-phase-" + i + "\">" + players[i]["phase"] + "</td><td class=\"table-cell center-align\" id=\"player-last-points-" + i + "\">" + players[i]["last_points"] + "</td><td class=\"table-cell center-align\" id=\"player-points-" + i + "\">" + players[i]["points"] + "</td></tr>");
            
            if(players[i]["dealer"] == true) 
            {
                $('#playerinfo_header_'+i).addClass('dealer-highlight');
            }
            else
            {
                $('#playerinfo_header_'+i).removeClass('dealer-highlight');
            }
            
            $('.player-phase').click(function(){
                card_id = $('#phase-card-id').val();
                phase_id = $(this).html();
                createPhaseCard(card_id, phase_id)
            });

        }
    }
    
    //Runde abschließen
    $('#finish-round').click(function(){
        console.info("Runde abschließen Dialog gestartet");
        create_finish_round_dialog();

        if(devMode == false)
        {
            $('#finish-form').show(500);
            $('#game-field-wrapper').hide(500);
            $('#edit-round-wrapper').hide(500);
        }

        //data-checkbox-id=\"" + i +"\"
    });
    
    $('#edit-last').click(function(){
        console.info("Runde bearbeiten Dialog gestartet");
        
        $('#round-number').html("");
        
        num_rounds = players[0]["rounds"].length;
        
        for(i = num_rounds-1; i >=0 ; i--)
        {
            var rnd_display = i+1; 
            var rnd = (i == num_rounds-1) ? "Letzte" : rnd_display + ".";
            $('#round-number').append("<option value=\"" + i + "\">"+rnd+" Runde</option>");
        }
        
        create_finish_round_dialog(true);
        
        $('#round-number').change(function(){
            create_finish_round_dialog(true);
        });        

        if(devMode == false)
        {
            $('#edit-round-wrapper').show(500);
            $('#finish-form').hide(500);
            $('#game-field-wrapper').hide(500);
        }
    });
        

    
    function create_finish_round_dialog(edit_round = false)
    {
        num_players = players.length;
        $('#finish-input-wrapper').html("");
        $('#edit-input-wrapper').html("");
        
            
        for (i = 0; i < num_players; i++)
        {
            if(edit_round == true)
            {
                var round = $('#round-number').val();
                var points = players[i]["rounds"][round]["points"];
                var phase = (players[i]["rounds"][round]["completed"] == true) ? "checked=\"checked\"" : "";
                var input_wrapper = "#edit-input-wrapper";
                
            }
            else
            {
                var round = -1;
                var points = "";
                var phase = "";
                var input_wrapper = "#finish-input-wrapper";
            }
            
            var player_name = players[i]["name"];
            
            $(input_wrapper).append("<tr class=\"table-row\"><td>"+player_name+"</td><td class=\"left-align\"><input id=\"player-points-input-"+i+"\" type=\"number\" min=\"0\" step=\"5\" class=\"finish-points-input\" data-checkbox-id=\""+i+"\" value=\""+points+"\"></td><td class=\"center-align\"><input id=\"player-phase-finish-"+i+"\" type=\"checkbox\" "+phase+"></td></tr>");
        }
        
        $(input_wrapper).prepend("<tr><td width=\"40%\"><img class=\"left\" src=\"gfx/user.png\"></td><td width=\"30%\"><img class=\"center\" src=\"gfx/trophy.png\"></td><td><img class=\"center\" src=\"gfx/phase-card.png\"></td></tr>");
        
        $(input_wrapper).append("<input type=\"hidden\" id=\"rnd-nmbr\" value=\""+round+"\">");
        
        $('.finish-points-input').change(function(){
            var plid  = $(this).attr("data-checkbox-id");
            console.info("Player ID ist "+plid+":");
            
            if($(this).val() < 50)
            {
                $('#player-phase-finish-'+plid).attr('checked', true);
                console.info("phase_finished set 2 true cause val = "+$(this).val());
            }
            else
            {
                $('#player-phase-finish-'+plid).attr('checked', false); 
                console.info("phase_finished set 2 false cause val = "+$(this).val());
            }
        });
        

    }
    
    //Speichert oder aktualisiert eine abgeschlossene Runde
    $('#save-round').click(function(){
        save_round(-1);

        if(devMode == false)
        {
            $('#finish-form').hide(500);
            $('#game-field-wrapper').show(500);
        }

    });

    $('#edit-round-btn').click(function(){
        var round = $('#rnd-nmbr').val();
        save_round(round);
        
        if(devMode == false)
        {
            $('#edit-round-wrapper').hide(500);
            $('#game-field-wrapper').show(500);
        }
    });
    
    //Speichert eine abgeschlossene Runde und aktualisiert die Daten aller Spieler
    function save_round(round)
    {
        
        if(round == -1)
        {
            var rnd_num = players[0]["rounds"].length;
        }
        else
        {
            var rnd_num = round; 
        }
        
                
        num_players = players.length;
        console.warn("Current players: "+num_players);
        
        var newDealer = 0;

        for(i=0; i<num_players; i++)
        {
            players[i]["rounds"][rnd_num] = new Array();
            
            player_points = $('#player-points-input-'+ i +'').val();
            if($('#player-phase-finish-'+ i +'').is(":checked"))
            {
                phase_completed = true;
            }
            
            else
            {
                phase_completed = false;  
            }
            
            
            if(round == -1)
            {
                if(players[i]["dealer"] == true)
                {
                    if((i+1) >= num_players)
                    {
                        newDealer = 0;
                        
                    }
                    else
                    {
                        console.info("Player " +i+ " is current Dealer.");
                        newDealer = i+1;
                    }
                    players[i]["dealer"] = false;
                }
            }       
            
            console.info("Phase complete "+phase_completed+" on User "+players[i]["name"]);
            
            players[i]["rounds"][rnd_num]["points"]   = player_points;
            players[i]["rounds"][rnd_num]["completed"] = phase_completed;
            
            console.info("Data saved: "+players[i]["rounds"][rnd_num]["points"]+" Points on "+ players[i]["name"] + " (Round "+rnd_num+")");
        }
        
        if(round == -1)
        {
            players[newDealer]["dealer"] = true;  
            console.info("Player " +newDealer+ " is the new Dealer.");
        }
        
        
        
        update_player_info();
        
        
    }
    
    //Berechnet die Punkte und Phasen aller Spieler neu
    function update_player_info()
    {
        
        num_players = players.length;
        
        //Edit Button anzeigen, sobald die erste Runde gespielt ist.
        if(players[0]["rounds"].length > 0)
        {
            $('#edit-last').css('visibility', 'visible');
        }
        
        
        for(i=0; i<num_players; i++)
        {
            num_rounds  = players[i]["rounds"].length;
            reset_player_info(i);
            
            if(players[i]["dealer"] == true) 
            {
                $('#playerinfo_header_'+i).addClass('dealer-highlight');
            }
            else
            {
                $('#playerinfo_header_'+i).removeClass('dealer-highlight');
            }
            
            for(j = 0; j < num_rounds; j++)
            {
                players[i]["points"] = parseInt(players[i]["points"]) + parseInt(players[i]["rounds"][j]["points"]);
                
                if(players[i]["rounds"][j]["completed"] == true)
                {
                    players[i]["phase"] = parseInt(players[i]["phase"])+ 1;
                }
                
                
                if(j+1 == num_rounds)
                {
                    players[i]["last_points"] = parseInt(players[i]["rounds"][j]["points"]);
                }
                
                
            }
            
            console.info(players[i]["name"] + " has "+players[i]["points"]+" Points right now");
            console.info(players[i]["name"] + " in Phase "+players[i]["phase"]+" right now");
            $('#player-phase-'+i).html(players[i]["phase"]);
            $('#player-points-'+i).html(players[i]["points"]);
            $('#player-last-points-'+i).html(players[i]["last_points"]);
            
        }
        
        console.info(players[0]["rounds"].length + " Rounds has been played");
        console.info("-------------------------");
    }
    
    //Setzt alle Werte des Spieler auf Standardeinstellungen zurück
    function reset_player_info(player_id)
     {
            players[player_id]["points"] = 0;
            players[player_id]["last_points"] = 0;
            players[player_id]["phase"] = 1;
     }
});