module Api
  class BoardMembershipsController < ApiController
    def create
      @board_membership = current_board.board_memberships.new(board_membership_params)

      if @board_membership.save
        render json: @board_membership
      else
        render json: @board_membership.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @board_membership = BoardMembership.find(params[:id])
      @board_membership.try(:destroy)
      render json: {}
    end

    private

    def current_board
      if params[:id]
        @board_membership = BoardMembership.find(params[:id])
        @current_board = @board_membership.board
      else
        @current_board = Board.find(params[:board_membership][:board_id])
      end
    end

    def board_membership_params
      params.require(:board_membership).permit(:user_id)
    end
  end
end
