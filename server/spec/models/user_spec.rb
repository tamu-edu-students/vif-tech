require 'rails_helper'

RSpec.describe User, type: :model do
  # puts :username
  it { should validate_presence_of(:username) }
  it { should validate_presence_of(:password) }
  it {
    should validate_length_of(:username)
      .is_at_least(4)   }
end
