class Score < ActiveRecord::Base
	belongs_to :user

	validates :value, numericality: true
	validates :user_id, presence: true
end
