class AlimentsController < ApplicationController
  autocomplete :aliment, :name

  before_action :set_search_action
  before_action :set_page, only: :index

  def index
    if params[:inputed_name].present?
      @aliments = Aliment.search(
        params[:inputed_name],
        page: params[:page],
        per_page: 20,
        operator: 'or',
        fields: [
          { name: :word_start },
          { food_group: :word_start }
        ]
      )
    else
      @aliments = Aliment.search('*', page: params[:page], per_page: 20)
      @aliment = nil
    end
  end

  def show
    @aliment = Aliment.find params[:id]
  end

  private

  def aliment_params
    params.require(:aliment).permit(:name, :food_group)
  end

  def set_search_action
    redirect_to action: :index, inputed_name: params[:name] if params.include?(:name)
  end
end
