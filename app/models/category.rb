class Category < ActiveRecord::Base
	has_many :clues

	def self.generate_round(round)
		categories = Category.where(round: round)
		round_categories = []
		while round_categories.length < 6 do
			index = rand(1..categories.length)
			# index = 621
			category = categories[index]
			is_valid = true
			
			category.clues.each do |clue|
				if clue.question == ''
					is_valid = false
				end
				if clue.question.include? '<a href'
					is_valid = false
				end
			end
			if round_categories.length > 0
				round_categories.each do |round_category|
					if category.id == round_category.id
						is_valid = false
					end
				end
			end

			if is_valid
				round_categories.push category
			end
		end
		round_categories
	end
end
