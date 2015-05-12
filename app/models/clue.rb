class Clue < ActiveRecord::Base
	belongs_to :category

	validates :value, numericality: true
	validates :value, inclusion: {in: [0,100,200,300,400,500,600,800,1000]}
	validates :category_id, presence: true

end
