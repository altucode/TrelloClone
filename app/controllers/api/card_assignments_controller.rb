module Api
  class CardAssignmentsController < ApiController
    def create
      @card_assignment = current_card.card_assignments.new(card_assignment_params)

      if @card_assignment.save
        render json: @card_assignment
      else
        render json: @card_assignment.errors.full_messages, status: :unprocessable_entity
      end
    end

    def destroy
      @card_assignment = CardAssignment.find(params[:id])
      @card_assignment.try(:destroy)
      render json: {}
    end

    private

    def current_card
      if params[:id]
        @card_assignment = CardAssignment.find(params[:id])
        @current_card = @card_assignment.card
      else
        @current_card = Board.find(params[:card_assignment][:card_id])
      end
    end

    def card_assignment_params
      params.require(:card_assignment).permit(:user_id)
    end
  end
end
