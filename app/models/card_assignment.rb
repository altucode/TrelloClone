# == Schema Information
#
# Table name: card_assignments
#
#  id         :integer          not null, primary key
#  card_id    :integer          not null
#  user_id    :integer          not null
#  created_at :datetime
#  updated_at :datetime
#

class CardAssignment < ActiveRecord::Base
  belongs_to :card, inverse_of: :card_assignments
  belongs_to :user, inverse_of: :card_assignments

  validates :card, :user, presence: true
end
