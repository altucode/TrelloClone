# == Schema Information
#
# Table name: cards
#
#  id          :integer          not null, primary key
#  title       :string(255)      not null
#  list_id     :integer          not null
#  description :text
#  ord         :float            default(0.0)
#  created_at  :datetime
#  updated_at  :datetime
#

class Card < ActiveRecord::Base
  belongs_to :list
  has_many :items, dependent: :destroy
  has_many :card_assignments, dependent: :destroy
  has_many :users, through: :card_assignments, source: :user

  default_scope { order(:ord) }

  validates :list, presence: true
end
