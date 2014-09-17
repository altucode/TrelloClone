# write some jbuilder to return some json about a board
# it should include the board
#  - its lists
#    - the cards for each list

json.title @board.title
json.user_id @board.user_id

json.lists @board.lists do |list|
  json.extract! list, :id, :title
  json.cards list.cards do |card|
    json.extract! card, :id, :title, :list_id, :description, :ord
    json.members card.card_assignments do |assn|
      json.extract! assn, :id, :user_id
      json.email assn.user.email
      json.gravatar_url assn.user.gravatar_url
    end
    json.items card.items
  end
end
