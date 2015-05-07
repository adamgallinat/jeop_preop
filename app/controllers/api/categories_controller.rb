module Api
	class CategoriesController < ApplicationController

		def index
			@categories = Category.all
			render json: @categories.to_json(include: :clues)
		end

		def show
			@category = Category.find(params[:id])
			render json: @category.to_json(include: :clues)
		end

		def by_season
			@categories = Category.where(season: params[:id])
			render json: @categories.to_json(include: :clues)
		end

		def by_airdate
			@categories = Category.where(air_date: params[:date])
			render json: @categories.to_json(include: :clues)
		end

		def new_game
			@round_one = Category.generate_round('jeopardy')
			@round_two = Category.generate_round('double jeopardy')

			@categories = @round_one + @round_two

			render json: @categories.to_json(include: :clues)
		end
	end
end