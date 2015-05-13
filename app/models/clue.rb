class Clue < ActiveRecord::Base
	belongs_to :category

	validates :value, numericality: true
	validates :value, inclusion: {in: [0,200,400,600,800,1000,1200,1600,1800,2000]}
	validates :category_id, presence: true

end
