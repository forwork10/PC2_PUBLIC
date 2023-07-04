try{

var mtr=Timers.GetContext().Get("Main");

var state=Properties.GetContext().Get("State");



Damage.GetContext().FriendlyFire.Value=GameMode.Parameters.GetBool("FriendlyFire");

Map.Rotation=GameMode.Parameters.GetBool("MapRotation");

BreackGraph.OnlyPlayerBlocksDmg=GameMode.Parameters.GetBool("PartialDesruction");

BreackGraph.WeakBlocks=GameMode.Parameters.GetBool("LoosenBlocks");



BreackGraph.PlayerBlockBoost=1;



TeamsBalancer.IsAutoBalance=1;

Ui.GetContext().MainTimerId.Value=mtr.Id;



Teams.Add("Blue","Teams/Blue",{b:1});

Teams.Add("Red","Teams/Red",{r:1});

var bt=Teams.Get("Blue");

var rt=Teams.Get("Red");

bt.Spawns.SpawnPointsGroups.Add(1);

rt.Spawns.SpawnPointsGroups.Add(2);

bt.Build.BlocksSet.Value=BuildBlocksSet.Blue;

rt.Build.BlocksSet.Value=BuildBlocksSet.Red;



var maxDeaths=Players.MaxCount*5;

Teams.Get("Red").Properties.Get("Deaths").Value=maxDeaths;

Teams.Get("Blue").Properties.Get("Deaths").Value=maxDeaths;



LeaderBoard.PlayerLeaderBoardValues=[{

Value:"Kills",

DisplayName:"Statistics/KillsShort"

},{

Value:"Deaths",

DisplayName:"Statistics/DeathsShort"

},{

Value:"Scores",

DisplayName:"Statistics/ScoresShort"

}];

LeaderBoard.TeamLeaderBoardValue={

Value:"Deaths",

DisplayName:"Statistics\Deaths",

};



LeaderBoard.TeamWeightGetter.Set(function(t){

return t.Properties.Get("Deaths").Value;

});



LeaderBoard.PlayersWeightGetter.Set(function(p){

return p.Properties.Get("Kills").Value;

});



Ui.GetContext().TeamProp1.Value={Team:"Blue",Prop:"Deaths"};

Ui.GetContext().TeamProp2.Value={Team:"Red",Prop:"Deaths"};



Teams.OnRequestJoinTeam.Add(function(p,t){t.Add(p);});

Teams.OnPlayerChangeTeam.Add(function(p){p.Spawns.Spawn()});



Spawns.GetContext().OnSpawn.Add(function(p){

p.Properties.Immortality.Value=1;

p.Timers.Get("imm").Restart(3);

});

Timers.OnPlayerTimer.Add(function(t){

if(t.Id=="imm")t.Player.Properties.Immortality.Value=0;

});



Properties.OnPlayerProperty.Add(function(c,v){if(v.Name=="Deaths"&&c.Player.Team!=null)c.Player.Team.Properties.Get("Deaths").Value--;

});

Properties.OnTeamProperty.Add(function(c,v){

if(v.Name=="Deaths"&&v.Value<=0)EndMatchMode();

});



Damage.OnDeath.Add(function(p){

	++p.Properties.Deaths.Value;

});

Damage.OnKill.Add(function(p,k){

if(p!=k){p.Properties.Kills.Value++;

p.Properties.Scores.Value+=100;}

});



mtr.OnTimer.Add(function(){

switch(state.Value){

case "w":

SetBuildMode();

break;	

case "b":

SetGameMode();

break;

case "g":

EndMatchMode();

break;

case "e":

Game.RestartGame();

break;

}});



SetWaitingMode();



var inventory=Inventory.GetContext();

inventory.Main.Value=0;

inventory.Secondary.Value=0;

inventory.Melee.Value=0;

inventory.Explosive.Value=0;

inventory.Build.Value=0;



function SetWaitingMode(){

state.Value="w";

Ui.GetContext().Hint.Value="Hint/WaitingPlayers";

Spawns.GetContext().enable=0;

mtr.Restart(10);

}



function SetBuildMode(){

state.Value="b";

Ui.GetContext().Hint.Value="Hint/BuildBase";

inventory.Melee.Value=1;

inventory.Build.Value=1;

mtr.Restart(30);

Spawns.GetContext().enable=1;

SpawnTeams();

}



function SetGameMode(){

state.Value="g";

Ui.GetContext().Hint.Value="Hint/AttackEnemies";

inventory.Main.Value=1;

inventory.Secondary.Value=1;

inventory.Explosive.Value=1;

mtr.Restart(600);

SpawnTeams();

}



function EndMatchMode(){

state.Value="e";

Ui.GetContext().Hint.Value="Hint/EndOfMatch";

s=Spawns.GetContext();

s.enable=0;

s.Despawn();

Game.GameOver(LeaderBoard.GetTeams());

mtr.Restart(10);

}



function SpawnTeams(){

rt.Spawns.Spawn();

bt.Spawns.Spawn();

}}catch(err){Ui.GetContext().Hint.Value=err.message;} 
