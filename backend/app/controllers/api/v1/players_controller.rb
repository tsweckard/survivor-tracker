module Api
  module V1
    class PlayersController < ApplicationController
      before_action :set_season
      before_action :set_player, only: [:update, :destroy]

      def create
        player = @season.players.create!(player_params)
        render json: player.as_json(only: [:id, :name, :tribe_id, :status,
                                           :athleticism, :social, :strategic,
                                           :likability, :loyalty]), status: :created
      end

      def update
        @player.update!(player_params)
        render json: @player.as_json(only: [:id, :name, :tribe_id, :status,
                                            :athleticism, :social, :strategic,
                                            :likability, :loyalty])
      end

      def destroy
        @player.destroy!
        head :no_content
      end

      private

      def set_season
        @season = Season.find(params[:season_id])
      end

      def set_player
        @player = @season.players.find(params[:id])
      end

      def player_params
        params.require(:player).permit(:name, :tribe_id, :athleticism, :social,
                                       :strategic, :likability, :loyalty)
      end
    end
  end
end
