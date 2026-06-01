module Api
  module V1
    class TribesController < ApplicationController
      before_action :set_season
      before_action :set_tribe, only: [:update, :destroy]

      def create
        tribe = @season.tribes.create!(tribe_params)
        render json: tribe.as_json(only: [:id, :name, :color, :status]), status: :created
      end

      def update
        @tribe.update!(tribe_params)
        render json: @tribe.as_json(only: [:id, :name, :color, :status])
      end

      def destroy
        @tribe.destroy!
        head :no_content
      end

      private

      def set_season
        @season = Season.find(params[:season_id])
      end

      def set_tribe
        @tribe = @season.tribes.find(params[:id])
      end

      def tribe_params
        params.require(:tribe).permit(:name, :color)
      end
    end
  end
end
