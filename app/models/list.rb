# == Schema Information
#
# Table name: lists
#
#  id         :integer          not null, primary key
#  title      :string(255)      not null
#  board_id   :integer          not null
#  ord        :float            default(0.0)
#  created_at :datetime
#  updated_at :datetime
#

class List < ActiveRecord::Base
  validates :title, :board, :ord, presence: true

  belongs_to :board, inverse_of: :lists
  has_many :cards, inverse_of: :list, dependent: :destroy

  default_scope { order(:ord) }

  # TODO: class method for updating orders?
end
