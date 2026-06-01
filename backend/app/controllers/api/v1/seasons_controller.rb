module Api
  module V1
    class SeasonsController < ApplicationController
      before_action :set_season, only: [:show, :activate]

      def index
        seasons = Season.order(created_at: :desc)
        render json: seasons.as_json(only: [:id, :name, :status, :game_phase])
      end

      def create
        season = Season.create!(season_params)
        render json: season_json(season), status: :created
      end

      def show
        render json: season_json(@season)
      end

      def activate
        unless @season.setup?
          return render json: { error: "Season is not in setup phase" }, status: :unprocessable_entity
        end
        @season.update!(status: :active)
        render json: season_json(@season)
      end

      private

      def set_season
        @season = Season.includes(:tribes, :players).find(params[:id])
      end

      def season_params
        params.require(:season).permit(:name)
      end

      def season_json(season)
        season.as_json(
          only: [:id, :name, :status, :game_phase],
          include: {
            tribes:  { only: [:id, :name, :color, :status] },
            players: { only: [:id, :name, :tribe_id, :status,
                               :athleticism, :social, :strategic,
                               :likability, :loyalty] }
          }
        )
      end
    end
  end
end
