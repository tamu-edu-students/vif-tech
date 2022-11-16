require 'rails_helper'

RSpec.describe Company, type: :model do
  it "displays only some information of a company to students" do
    company = Company.create(:name => 'disney', :id => 2, :description => 'Ewoooo...!/\~@', :logo_src => 'https://thumbs.dreamstime.com/b/disney-company-logo-sign-grey-plastic-letters-white-wall-moscow-russia-march-86290724.jpg')
    # p company
    c = company.showForStudent(company.id) 
    # p c 
    assert_raises(ActiveModel::MissingAttributeError) {c.created_at}
    assert_raises(ActiveModel::MissingAttributeError) {c.updated_at}
    expect(c.id).to be(2)
    expect(c.description).to eq('Ewoooo...!/\~@')
    expect(c.logo_src).to eq('https://thumbs.dreamstime.com/b/disney-company-logo-sign-grey-plastic-letters-white-wall-moscow-russia-march-86290724.jpg')
  end
end