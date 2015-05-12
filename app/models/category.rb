class Category < ActiveRecord::Base
	has_many :clues

	validates_each :air_date do |record, attr, value|
		begin
			Date.parse(record.air_date)
		rescue
			record.errors.add(attr, 'invalid date')
		end
	end

	validates :title, presence: true
	validates :season, presence: true
	validates :season, numericality: true
	validates :air_date, presence: true
	# validates :air_date, format: { with: /\A\d{4}\/\d{2}\/\d{2}\z/, message: 'not a valid date'}

	def self.generate_round(round)
		categories = Category.where(round: round)
		if round != 'final jeopardy'
			round_categories = []
			while round_categories.length < 6 do
				index = rand(1..categories.length)
				category = categories[index]
				is_valid = true
				
				#occassional bug here. if clues == nil? "undefined method `clues' for nil:NilClass"
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
		else
			round_categories = []
			is_valid = false
			while is_valid == false
				index = rand(1..categories.length)
				category = categories[index]
				is_valid = true
				if category.clues[0].question.include? '<a href'
					is_valid = false
				end
			end
			round_categories.push(category)
			round_categories
		end
	end
end
