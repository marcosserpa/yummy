class AlimentsController < ApplicationController

  autocomplete :aliment, :name

  def index
    @aliments = if (params[:aliment].present? && !params[:aliment][:name].blank?)
      Aliment.search(params[:aliment][:name], operator: 'or', page: params[:page], per_page: 20, fields: [
        { name: :word_start },
        { food_group: :word_start }
      ])
    else
      Aliment.search('*', page: params[:page], per_page: 20)
    end
  end

  def show
    @aliment = Aliment.find params[:id]
  end


  private

  def aliment_params
    params.require(:aliment).permit(:name, :food_group)
  end

end