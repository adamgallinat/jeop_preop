class Score < ActiveRecord::Base
	belongs_to :user

	validates :value, presence: true
	validates :value, numericality: true
	validates :user_id, presence: true
end
