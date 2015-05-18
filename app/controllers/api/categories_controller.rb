module Api
	class CategoriesController < ApplicationController

		def show
			@category = Category.find(params[:id])
			render json: @category.to_json(include: :clues)
		end

		def by_season
			@categories = Category.where(season: params[:id])
			render json: @categories.to_json
		end

		def by_airdate
			@categories = Category.where(air_date: params[:date])
			render json: @categories.to_json
		end

		def new_game
			@round_one = Category.generate_round('jeopardy')
			@round_two = Category.generate_round('double jeopardy')
			@round_three = Category.generate_round('final jeopardy')

			@categories = @round_one + @round_two + @round_three

			render json: @categories.to_json(include: :clues)
		end
	end
end