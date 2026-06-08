module Api
  module V1
    class SeasonsController < ApplicationController
      before_action :set_season, only: [:show, :activate]

      def index
        seasons = Season.includes(:tribes, :players, :episodes).order(created_at: :desc)
        render json: seasons.map { |s| season_summary_json(s) }
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
        params.require(:season).permit(:name, :season_number, :location, :premiered_on, :ended_on)
      end

      def season_summary_json(season)
        season.as_json(only: [:id, :name, :status, :game_phase, :season_number, :location, :premiered_on, :ended_on])
          .merge(
            tribe_colors: season.tribes.map(&:color),
            player_count: season.players.size,
            booted_count: season.players.count { |p| %w[jury eliminated].include?(p.status) },
            episode_count: season.episodes.size
          )
      end

      def season_json(season)
        season.as_json(
          only: [:id, :name, :status, :game_phase, :season_number, :location, :premiered_on, :ended_on],
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
