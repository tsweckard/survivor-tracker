TribalCouncil.destroy_all
Episode.destroy_all
AllianceMembership.destroy_all
Alliance.destroy_all
Player.destroy_all
Tribe.destroy_all
Season.destroy_all

season = Season.create!(name: "Survivor: Borneo", game_phase: :pre_merge, status: :active)

tagi  = Tribe.create!(name: "Tagi",  color: "#FF4500", season: season)
pagong = Tribe.create!(name: "Pagong", color: "#1E90FF", season: season)

tagi_names  = ["Richard", "Susan", "Kelly", "Rudy"]
pagong_names = ["Gervase", "Colleen", "Greg", "Jenna"]

[tagi_names, pagong_names].zip([tagi, pagong]).each do |names, tribe|
  names.each do |name|
    Player.create!(
      name: name,
      season: season,
      tribe: tribe,
      athleticism: rand(1..10),
      social:      rand(1..10),
      strategic:   rand(1..10),
      likability:  rand(1..10),
      loyalty:     rand(1..10)
    )
  end
end

puts "Seeded: #{season.name} | #{season.tribes.count} tribes | #{season.players.count} players"
