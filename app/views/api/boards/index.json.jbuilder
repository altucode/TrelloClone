json.array! @boards do |board|
  json.extract! board, :id, :title, :user_id

  json.user board.user, :id, :email, :gravatar_url
end