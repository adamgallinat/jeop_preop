class ScoresController < ApplicationController

	def index
		@scores = Score.all
		render json: @scores
	end

	def show
		@score = Score.find(params[:id])
		render json: @score
	end

	def create
		@score = Score.new
		@score.value = params[:value]
		@score.user_id = params[:user_id]
		@score.save

		render json: @score
	end

	def delete
		@score = Score.find(params[:id])
		@score.delete

		render json: score
	end

	def by_user
		@scores = Score.where(user_id: params[:user_id])
		render json: @scores
	end

end