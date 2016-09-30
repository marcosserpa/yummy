class AlimentsController < ApplicationController

  autocomplete :aliment, :name#, full: true

  def index
    if params['aliment']['name'].present?
      @aliment = Aliment.where("name ilike ?", params['aliment']['name']).first
    else
      @aliments = if (params[:aliment].present? && !params[:aliment][:name].blank?)
        Aliment.search(params[:aliment][:name], operator: 'or', page: params[:page], per_page: 20, fields: [
          { name: :word_start },
          { food_group: :word_start }
        ])
      else
        Aliment.search('*', page: params[:page], per_page: 20)
      end

      @aliment = nil
    end
  end

  def show
    binding.pry
    @aliment = Aliment.find params[:id]
  end


  private

  def aliment_params
    params.require(:aliment).permit(:name, :food_group)
  end

end
